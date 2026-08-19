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

export default function TambahCabang() {
  const router = useRouter()
  const [form, setForm] = useState({
    nama: '', tipe: 'representatif', kota: '', alamat: '', telepon: '',
    whatsapp: '', jam_layanan: '', email: '', google_maps_url: '',
  })
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
    await adminCreate('cabang', form)
    setLoading(false)
    router.push('/admin/cabang')
  }

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tambah Cabang</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Cabang</Label>
                <Input id="nama" required placeholder="Nama cabang" value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe">Tipe</Label>
                <Select value={form.tipe} onValueChange={(v) => setForm({ ...form, tipe: v })}>
                  <SelectTrigger id="tipe" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pusat">Pusat</SelectItem>
                    <SelectItem value="representatif">Representatif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kota">Kota</Label>
                <Input id="kota" required placeholder="Kota" value={form.kota}
                  onChange={(e) => setForm({ ...form, kota: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea id="alamat" placeholder="Alamat lengkap" value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" placeholder="Nomor WhatsApp (62xxx)" value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telepon">Telepon</Label>
                <Input id="telepon" placeholder="Nomor telepon" value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jam_layanan">Jam Layanan</Label>
                <Input id="jam_layanan" placeholder="Jam layanan" value={form.jam_layanan}
                  onChange={(e) => setForm({ ...form, jam_layanan: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Google Maps</Label>
                <Input id="google_maps_url" placeholder="Link Google Maps" value={form.google_maps_url}
                  onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })} />
              </div>
              <Button type="submit" variant="secondary" disabled={loading} className="w-full">
                {loading ? 'Menyimpan...' : 'Simpan Cabang'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
