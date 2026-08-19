'use client'

import { useEffect, useState, use } from 'react'
import { supabase, Cabang } from '@/lib/supabase'
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

export default function EditCabang({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [cabang, setCabang] = useState<Cabang | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function muat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await adminGet<Cabang>('cabang', id)
      setCabang(data)
      setLoading(false)
    }
    muat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!cabang) return
    await adminUpdate('cabang', id, {
      nama: cabang.nama, tipe: cabang.tipe, kota: cabang.kota, alamat: cabang.alamat,
      telepon: cabang.telepon, whatsapp: cabang.whatsapp, jam_layanan: cabang.jam_layanan,
      email: cabang.email, google_maps_url: cabang.google_maps_url, status: cabang.status,
    })
    alert('Cabang tersimpan.')
    router.push('/admin/cabang')
  }

  if (loading || !cabang) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Cabang</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Cabang</Label>
                <Input id="nama" value={cabang.nama} onChange={(e) => setCabang({ ...cabang, nama: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe">Tipe</Label>
                <Select value={cabang.tipe} onValueChange={(v) => setCabang({ ...cabang, tipe: v as Cabang['tipe'] })}>
                  <SelectTrigger id="tipe" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pusat">Pusat</SelectItem>
                    <SelectItem value="representatif">Representatif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kota">Kota</Label>
                <Input id="kota" value={cabang.kota} onChange={(e) => setCabang({ ...cabang, kota: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea id="alamat" value={cabang.alamat ?? ''} onChange={(e) => setCabang({ ...cabang, alamat: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" value={cabang.whatsapp ?? ''} onChange={(e) => setCabang({ ...cabang, whatsapp: e.target.value })} placeholder="WhatsApp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telepon">Telepon</Label>
                <Input id="telepon" value={cabang.telepon ?? ''} onChange={(e) => setCabang({ ...cabang, telepon: e.target.value })} placeholder="Nomor telepon" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={cabang.email ?? ''} onChange={(e) => setCabang({ ...cabang, email: e.target.value })} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jam_layanan">Jam Layanan</Label>
                <Input id="jam_layanan" value={cabang.jam_layanan ?? ''} onChange={(e) => setCabang({ ...cabang, jam_layanan: e.target.value })} placeholder="Jam layanan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Google Maps</Label>
                <Input id="google_maps_url" value={cabang.google_maps_url ?? ''} onChange={(e) => setCabang({ ...cabang, google_maps_url: e.target.value })} placeholder="Link Google Maps" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={cabang.status} onValueChange={(v) => setCabang({ ...cabang, status: v as Cabang['status'] })}>
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
