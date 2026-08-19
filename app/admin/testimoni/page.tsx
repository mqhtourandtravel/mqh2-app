'use client'

import { useEffect, useState } from 'react'
import { supabase, Testimoni } from '@/lib/supabase'
import { adminList, adminDelete } from '@/lib/adminApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'

export default function AdminListTestimoni() {
  const [list, setList] = useState<Testimoni[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function muat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await adminList<Testimoni>('testimoni', { orderBy: 'urutan' })
      setList(data)
      setLoading(false)
    }
    muat()
  }, [router])

  async function hapus(id: string) {
    if (!confirm('Hapus testimoni ini?')) return
    await adminDelete('testimoni', id)
    setList((prev) => prev.filter((t) => t.id !== id))
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Kelola Testimoni</CardTitle>
            <CardAction className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/paket"><ArrowLeft className="size-4" /> Kembali</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin/testimoni/baru"><Plus className="size-4" /> Tambah</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            {list.map((t) => (
              <div key={t.id} className="border border-accent rounded-lg p-4 flex justify-between items-start gap-4">
                <div>
                  <p className="text-[13.5px] italic text-primary mb-1">&ldquo;{t.isi}&rdquo;</p>
                  <p className="text-[12px] font-semibold text-secondary-hover">{t.nama_sumber}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button asChild variant="ghost" size="icon" className="size-8 text-secondary-hover">
                    <Link href={`/admin/testimoni/${t.id}`}><Pencil className="size-4" /></Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => hapus(t.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {list.length === 0 && <p className="text-muted-foreground text-[13px]">Belum ada testimoni.</p>}
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
