'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { adminCreate } from '@/lib/adminApi'
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

function buatSlug(judul: string) {
  return judul.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

export default function TulisArtikel() {
  const router = useRouter()
  const [form, setForm] = useState({ judul: '', ringkasan: '', konten: '', kategori: '', gambar_url: '', status: 'draft' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function cekLogin() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin/login')
    }
    cekLogin()
  }, [router])

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await adminCreate('artikel', { ...form, slug: buatSlug(form.judul) })
    setLoading(false)
    router.push('/admin/artikel')
  }

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tulis Artikel</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul</Label>
                <Input id="judul" required placeholder="Judul artikel" value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input id="kategori" placeholder="Kategori (mis. Tips Umroh)" value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ringkasan">Ringkasan</Label>
                <Textarea id="ringkasan" placeholder="Ringkasan singkat" value={form.ringkasan}
                  onChange={(e) => setForm({ ...form, ringkasan: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="konten">Isi Artikel</Label>
                <Textarea id="konten" required placeholder="Isi artikel lengkap" value={form.konten}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })} rows={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gambar_url">Gambar Sampul</Label>
                <Input id="gambar_url" placeholder="URL gambar sampul" value={form.gambar_url}
                  onChange={(e) => setForm({ ...form, gambar_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (belum tampil publik)</SelectItem>
                    <SelectItem value="terbit">Terbit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="secondary" disabled={loading} className="w-full">
                {loading ? 'Menyimpan...' : 'Simpan Artikel'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
