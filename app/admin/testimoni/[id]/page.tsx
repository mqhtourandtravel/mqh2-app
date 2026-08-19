'use client'

import { useEffect, useState, use } from 'react'
import { supabase, Testimoni } from '@/lib/supabase'
import { adminGet, adminUpdate } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function EditTestimoni({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [testimoni, setTestimoni] = useState<Testimoni | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function muat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await adminGet<Testimoni>('testimoni', id)
      setTestimoni(data)
      setLoading(false)
    }
    muat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!testimoni) return
    await adminUpdate('testimoni', id, {
      isi: testimoni.isi, nama_sumber: testimoni.nama_sumber, status: testimoni.status,
    })
    router.push('/admin/testimoni')
  }

  if (loading || !testimoni) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Testimoni</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isi">Isi Testimoni</Label>
                <Textarea id="isi" value={testimoni.isi} onChange={(e) => setTestimoni({ ...testimoni, isi: e.target.value })} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama_sumber">Nama Sumber</Label>
                <Input id="nama_sumber" value={testimoni.nama_sumber} onChange={(e) => setTestimoni({ ...testimoni, nama_sumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={testimoni.status} onValueChange={(v) => setTestimoni({ ...testimoni, status: v as Testimoni['status'] })}>
                  <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="secondary" className="w-full">Simpan</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
