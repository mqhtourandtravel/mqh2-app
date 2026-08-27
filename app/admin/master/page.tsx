'use client'

import { useEffect, useState } from 'react'
import { supabase, Maskapai, Hotel } from '@/lib/supabase'
import { adminList, adminCreate, adminDelete } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

export default function KelolaMasterData() {
  const router = useRouter()
  const [maskapaiList, setMaskapaiList] = useState<Maskapai[]>([])
  const [hotelList, setHotelList] = useState<Hotel[]>([])
  const [namaMaskapai, setNamaMaskapai] = useState('')
  const [namaHotel, setNamaHotel] = useState('')
  const [kotaHotel, setKotaHotel] = useState<'mekkah' | 'madinah'>('mekkah')
  const [mapsHotel, setMapsHotel] = useState('')
  const [loading, setLoading] = useState(true)

  async function muatSemua() {
    const [m, h] = await Promise.all([
      adminList<Maskapai>('maskapai', { orderBy: 'nama' }),
      adminList<Hotel>('hotel', { orderBy: 'nama' }),
    ])
    setMaskapaiList(m)
    setHotelList(h)
    setLoading(false)
  }

  useEffect(() => {
    async function cekLoginLaluMuat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      muatSemua()
    }
    cekLoginLaluMuat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function tambahMaskapai(e: React.FormEvent) {
    e.preventDefault()
    if (!namaMaskapai.trim()) return
    await adminCreate('maskapai', { nama: namaMaskapai })
    setNamaMaskapai('')
    muatSemua()
  }

  async function hapusMaskapai(id: string) {
    if (!confirm('Hapus maskapai ini? Jadwal yang memakainya akan kehilangan info maskapai.')) return
    await adminDelete('maskapai', id)
    muatSemua()
  }

  async function tambahHotel(e: React.FormEvent) {
    e.preventDefault()
    if (!namaHotel.trim()) return
    await adminCreate('hotel', { nama: namaHotel, kota: kotaHotel, google_maps_url: mapsHotel || null })
    setNamaHotel(''); setMapsHotel('')
    muatSemua()
  }

  async function hapusHotel(id: string) {
    if (!confirm('Hapus hotel ini?')) return
    await adminDelete('hotel', id)
    muatSemua()
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <>
      <main className="max-w-2xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Kelola Master Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-10 pb-8">
            <section>
              <h2 className="text-[15px] font-semibold text-primary mb-3">Maskapai</h2>
              <form onSubmit={tambahMaskapai} className="flex gap-2 mb-4">
                <Input
                  value={namaMaskapai}
                  onChange={(e) => setNamaMaskapai(e.target.value)}
                  placeholder="Nama maskapai"
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">Tambah</Button>
              </form>
              <div className="space-y-1">
                {maskapaiList.map((m) => (
                  <div key={m.id} className="flex justify-between items-center text-[13.5px] border-b border-accent py-2">
                    <span className="text-primary">{m.nama}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => hapusMaskapai(m.id)}
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-[15px] font-semibold text-primary mb-3">Hotel</h2>
              <form onSubmit={tambahHotel} className="space-y-2 mb-4">
                <Input
                  value={namaHotel}
                  onChange={(e) => setNamaHotel(e.target.value)}
                  placeholder="Nama hotel"
                />
                <div className="flex gap-2">
                  <Select value={kotaHotel} onValueChange={(v) => setKotaHotel(v as 'mekkah' | 'madinah')}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mekkah">Mekkah</SelectItem>
                      <SelectItem value="madinah">Madinah</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={mapsHotel}
                    onChange={(e) => setMapsHotel(e.target.value)}
                    placeholder="Link Google Maps (opsional)"
                    className="flex-1"
                  />
                </div>
                <Button type="submit" variant="secondary">Tambah Hotel</Button>
              </form>
              <div className="space-y-1">
                {hotelList.map((h) => (
                  <div key={h.id} className="flex justify-between items-center text-[13.5px] border-b border-accent py-2">
                    <span className="text-primary">{h.nama} <span className="text-muted-foreground">({h.kota})</span></span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => hapusHotel(h.id)}
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
