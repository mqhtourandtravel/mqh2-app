'use client'

import { useEffect, useState, use } from 'react'
import { supabase, Artikel } from '@/lib/supabase'
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

export default function EditArtikel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [artikel, setArtikel] = useState<Artikel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function muat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await adminGet<Artikel>('artikel', id)
      setArtikel(data)
      setLoading(false)
    }
    muat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!artikel) return
    await adminUpdate('artikel', id, {
      judul: artikel.judul, ringkasan: artikel.ringkasan, konten: artikel.konten,
      kategori: artikel.kategori, gambar_url: artikel.gambar_url, status: artikel.status,
    })
    router.push('/admin/artikel')
  }

  if (loading || !artikel) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Artikel</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul</Label>
                <Input id="judul" value={artikel.judul} onChange={(e) => setArtikel({ ...artikel, judul: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input id="kategori" value={artikel.kategori ?? ''} onChange={(e) => setArtikel({ ...artikel, kategori: e.target.value })} placeholder="Kategori" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ringkasan">Ringkasan</Label>
                <Textarea id="ringkasan" value={artikel.ringkasan ?? ''} onChange={(e) => setArtikel({ ...artikel, ringkasan: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="konten">Isi Artikel</Label>
                <Textarea id="konten" value={artikel.konten} onChange={(e) => setArtikel({ ...artikel, konten: e.target.value })} rows={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gambar_url">Gambar Sampul</Label>
                <Input id="gambar_url" value={artikel.gambar_url ?? ''} onChange={(e) => setArtikel({ ...artikel, gambar_url: e.target.value })} placeholder="URL gambar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={artikel.status} onValueChange={(v) => setArtikel({ ...artikel, status: v as Artikel['status'] })}>
                  <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="terbit">Terbit</SelectItem>
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
