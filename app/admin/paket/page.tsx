'use client'

import { useEffect, useState } from 'react'
import { supabase, Paket } from '@/lib/supabase'
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
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdminListPaket() {
  const [paketList, setPaketList] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function cekLoginDanAmbilData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      const data = await adminList<Paket>('paket', { orderBy: 'urutan' })
      setPaketList(data)
      setLoading(false)
    }
    cekLoginDanAmbilData()
  }, [router])

  async function hapusPaket(id: string, nama: string) {
    if (!confirm(`Yakin hapus paket "${nama}"? Aksi ini tidak bisa dibatalkan.`)) return
    await adminDelete('paket', id)
    setPaketList((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Kelola Paket</CardTitle>
            <CardAction className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/master">Master Data</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin/paket/baru">
                  <Plus className="size-4" /> Tambah Paket
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paketList.map((paket) => (
                  <TableRow key={paket.id}>
                    <TableCell className="font-medium text-primary">{paket.nama_paket}</TableCell>
                    <TableCell className="capitalize">{paket.kategori}</TableCell>
                    <TableCell><Badge variant="soft" className="normal-case tracking-normal">{paket.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button asChild variant="ghost" size="icon" className="size-8 text-secondary-hover">
                        <Link href={`/admin/paket/${paket.id}`}><Pencil className="size-4" /></Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => hapusPaket(paket.id, paket.nama_paket)}
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
