'use client'

import { useEffect, useState } from 'react'
import { supabase, Maskapai, Hotel } from '@/lib/supabase'
import { adminList, adminCreate, adminDelete } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plane, Building2, Plus, MapPin } from 'lucide-react'

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
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      muatSemua()
    }
    init()
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
    setNamaHotel('')
    setMapsHotel('')
    muatSemua()
  }

  async function hapusHotel(id: string) {
    if (!confirm('Hapus hotel ini?')) return
    await adminDelete('hotel', id)
    muatSemua()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-amber-500 animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Memuat master data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="size-7 text-emerald-700" /> Master Data Fasilitas
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Daftar referensi maskapai penerbangan dan hotel di Makkah & Madinah
        </p>
      </div>

      {/* 2-Column Grid for Airlines & Hotels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Maskapai */}
        <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-emerald-50/70 to-transparent border-b border-gray-100 p-5">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Plane className="size-5 text-emerald-700" /> Maskapai Penerbangan
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Total {maskapaiList.length} maskapai terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            {/* Add Airline Form */}
            <form onSubmit={tambahMaskapai} className="flex gap-2">
              <Input
                value={namaMaskapai}
                onChange={(e) => setNamaMaskapai(e.target.value)}
                placeholder="Contoh: Saudi Airlines, Garuda Indonesia..."
                className="flex-1 h-9 text-xs bg-gray-50/50 border-gray-300"
              />
              <Button type="submit" size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-9 gap-1 font-semibold px-4">
                <Plus className="size-3.5" /> Tambah
              </Button>
            </form>

            {/* Airline List */}
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden bg-gray-50/30">
              {maskapaiList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">Belum ada maskapai.</p>
              ) : (
                maskapaiList.map((m) => (
                  <div key={m.id} className="flex justify-between items-center px-4 py-2.5 text-xs hover:bg-white transition-colors">
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                      <Plane className="size-3.5 text-emerald-600" /> {m.nama}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => hapusMaskapai(m.id)}
                      className="size-7 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Hotels */}
        <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-amber-50/70 to-transparent border-b border-gray-100 p-5">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="size-5 text-amber-700" /> Hotel Makkah & Madinah
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Total {hotelList.length} hotel terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            {/* Add Hotel Form */}
            <form onSubmit={tambahHotel} className="space-y-2.5 bg-gray-50/40 p-3.5 rounded-lg border border-gray-100">
              <Input
                value={namaHotel}
                onChange={(e) => setNamaHotel(e.target.value)}
                placeholder="Nama Hotel (Contoh: Swissôtel Makkah)"
                className="h-8 text-xs bg-white border-gray-300"
              />
              <div className="flex gap-2">
                <Select value={kotaHotel} onValueChange={(v) => setKotaHotel(v as 'mekkah' | 'madinah')}>
                  <SelectTrigger className="w-[120px] h-8 text-xs bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mekkah" className="text-xs">Makkah</SelectItem>
                    <SelectItem value="madinah" className="text-xs">Madinah</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={mapsHotel}
                  onChange={(e) => setMapsHotel(e.target.value)}
                  placeholder="Link Google Maps (opsional)"
                  className="flex-1 h-8 text-xs bg-white border-gray-300"
                />
              </div>
              <Button type="submit" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 gap-1 font-semibold">
                <Plus className="size-3.5" /> Tambah Hotel
              </Button>
            </form>

            {/* Hotel List */}
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden bg-gray-50/30">
              {hotelList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">Belum ada hotel.</p>
              ) : (
                hotelList.map((h) => (
                  <div key={h.id} className="flex justify-between items-center px-4 py-2.5 text-xs hover:bg-white transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                        {h.nama}
                        {h.google_maps_url && (
                          <a href={h.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800">
                            <MapPin className="size-3" />
                          </a>
                        )}
                      </p>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded ${
                        h.kota === 'mekkah' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      } capitalize`}>
                        {h.kota}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => hapusHotel(h.id)}
                      className="size-7 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
