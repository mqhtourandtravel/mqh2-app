'use client'

import { useEffect, useState } from 'react'
import { supabase, Cabang } from '@/lib/supabase'
import { adminList, adminDelete } from '@/lib/adminApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'

export default function AdminListCabang() {
  const [cabangList, setCabangList] = useState<Cabang[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function cekLoginDanAmbilData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await adminList<Cabang>('cabang', { orderBy: 'urutan' })
      setCabangList(data)
      setLoading(false)
    }
    cekLoginDanAmbilData()
  }, [router])

  async function hapus(id: string, nama: string) {
    if (!confirm(`Yakin hapus cabang "${nama}"?`)) return
    await adminDelete('cabang', id)
    setCabangList((prev) => prev.filter((c) => c.id !== id))
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Kelola Cabang</CardTitle>
            <CardAction className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/paket"><ArrowLeft className="size-4" /> Kembali</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin/cabang/baru"><Plus className="size-4" /> Tambah Cabang</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabangList.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-primary">{c.nama}</TableCell>
                    <TableCell className="capitalize">{c.tipe}</TableCell>
                    <TableCell>{c.kota}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button asChild variant="ghost" size="icon" className="size-8 text-secondary-hover">
                        <Link href={`/admin/cabang/${c.id}`}><Pencil className="size-4" /></Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => hapus(c.id, c.nama)}
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
