'use client'

import { useEffect, useState } from 'react'
import { supabase, Artikel } from '@/lib/supabase'
import { adminList, adminDelete } from '@/lib/adminApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'

export default function AdminListArtikel() {
  const [list, setList] = useState<Artikel[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function muat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await adminList<Artikel>('artikel', { orderBy: 'diterbitkan_pada', dir: 'desc' })
      setList(data)
      setLoading(false)
    }
    muat()
  }, [router])

  async function hapus(id: string) {
    if (!confirm('Hapus artikel ini?')) return
    await adminDelete('artikel', id)
    setList((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Kelola Artikel</CardTitle>
            <CardAction className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/paket"><ArrowLeft className="size-4" /> Kembali</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin/artikel/baru"><Plus className="size-4" /> Tulis Artikel</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-primary">{a.judul}</TableCell>
                    <TableCell><Badge variant="soft" className="normal-case tracking-normal">{a.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button asChild variant="ghost" size="icon" className="size-8 text-secondary-hover">
                        <Link href={`/admin/artikel/${a.id}`}><Pencil className="size-4" /></Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => hapus(a.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
