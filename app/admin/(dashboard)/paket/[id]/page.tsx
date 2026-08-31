'use client'

import { useEffect, useState, use } from 'react'
import { supabase, Paket, Keberangkatan, Maskapai, Hotel } from '@/lib/supabase'
import { adminGet, adminList, adminCreate, adminUpdate, adminDelete } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Trash2 } from 'lucide-react'

const KOSONG_JADWAL = {
  tanggal_berangkat: '', durasi_hari: '', lokasi_keberangkatan: '',
  maskapai_id: '', hotel_mekkah_id: '', hotel_madinah_id: '',
  harga_normal: '', harga_promo: '', kuota_total: '', kuota_tersisa: '',
}

export default function EditPaket({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [paket, setPaket] = useState<Paket | null>(null)
  const [jadwalList, setJadwalList] = useState<Keberangkatan[]>([])
  const [maskapaiList, setMaskapaiList] = useState<Maskapai[]>([])
  const [hotelList, setHotelList] = useState<Hotel[]>([])
  const [formJadwal, setFormJadwal] = useState(KOSONG_JADWAL)
  const [editJadwalId, setEditJadwalId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function muatSemua() {
    const [p, j, m, h] = await Promise.all([
      adminGet<Paket>('paket', id),
      adminList<Keberangkatan>('keberangkatan', { orderBy: 'tanggal_berangkat', filter: { paket_id: id } }),
      adminList<Maskapai>('maskapai', { orderBy: 'nama' }),
      adminList<Hotel>('hotel', { orderBy: 'nama' }),
    ])
    setPaket(p)
    setJadwalList(j)
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

  async function simpanInfoPaket(e: React.FormEvent) {
    e.preventDefault()
    if (!paket) return
    await adminUpdate('paket', paket.id, {
      nama_paket: paket.nama_paket, kategori: paket.kategori, tier: paket.tier,
      deskripsi: paket.deskripsi, gambar_url: paket.gambar_url, status: paket.status,
    })
    alert('Info paket tersimpan.')
  }

  async function simpanJadwal(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      paket_id: id,
      tanggal_berangkat: formJadwal.tanggal_berangkat,
      durasi_hari: formJadwal.durasi_hari ? Number(formJadwal.durasi_hari) : null,
      lokasi_keberangkatan: formJadwal.lokasi_keberangkatan || null,
      maskapai_id: formJadwal.maskapai_id || null,
      hotel_mekkah_id: formJadwal.hotel_mekkah_id || null,
      hotel_madinah_id: formJadwal.hotel_madinah_id || null,
      harga_normal: Number(formJadwal.harga_normal),
      harga_promo: formJadwal.harga_promo ? Number(formJadwal.harga_promo) : null,
      kuota_total: Number(formJadwal.kuota_total),
      kuota_tersisa: Number(formJadwal.kuota_tersisa),
    }
    if (editJadwalId) {
      await adminUpdate('keberangkatan', editJadwalId, payload)
    } else {
      await adminCreate('keberangkatan', payload)
    }
    setFormJadwal(KOSONG_JADWAL)
    setEditJadwalId(null)
    muatSemua()
  }

  function mulaiEditJadwal(j: Keberangkatan) {
    setEditJadwalId(j.id)
    setFormJadwal({
      tanggal_berangkat: j.tanggal_berangkat,
      durasi_hari: j.durasi_hari?.toString() ?? '',
      lokasi_keberangkatan: j.lokasi_keberangkatan ?? '',
      maskapai_id: j.maskapai_id ?? '',
      hotel_mekkah_id: j.hotel_mekkah_id ?? '',
      hotel_madinah_id: j.hotel_madinah_id ?? '',
      harga_normal: j.harga_normal.toString(),
      harga_promo: j.harga_promo?.toString() ?? '',
      kuota_total: j.kuota_total.toString(),
      kuota_tersisa: j.kuota_tersisa.toString(),
    })
  }

  async function hapusJadwal(jadwalId: string) {
    if (!confirm('Hapus jadwal keberangkatan ini?')) return
    await adminDelete('keberangkatan', jadwalId)
    muatSemua()
  }

  if (loading || !paket) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardContent className="space-y-10 pt-6 pb-8">
            {/* Info umum paket */}
            <section>
              <h1 className="font-serif text-2xl mb-4 text-primary">Edit Paket: {paket.nama_paket}</h1>
              <form onSubmit={simpanInfoPaket} className="space-y-3">
                <Input
                  value={paket.nama_paket}
                  onChange={(e) => setPaket({ ...paket, nama_paket: e.target.value })}
                  placeholder="Nama paket"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={paket.kategori} onValueChange={(v) => setPaket({ ...paket, kategori: v as Paket['kategori'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umroh">Umroh</SelectItem>
                      <SelectItem value="haji">Haji</SelectItem>
                      <SelectItem value="badal">Badal</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={paket.tier ?? ''}
                    onChange={(e) => setPaket({ ...paket, tier: e.target.value })}
                    placeholder="Tier"
                  />
                </div>
                <Textarea
                  value={paket.deskripsi ?? ''}
                  onChange={(e) => setPaket({ ...paket, deskripsi: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi"
                />
                <Input
                  value={paket.gambar_url ?? ''}
                  onChange={(e) => setPaket({ ...paket, gambar_url: e.target.value })}
                  placeholder="URL gambar"
                />
                <Select value={paket.status} onValueChange={(v) => setPaket({ ...paket, status: v as Paket['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif (tampil di web)</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif (disembunyikan)</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" variant="secondary">Simpan Info Paket</Button>
              </form>
            </section>

            <Separator />

            {/* Daftar jadwal keberangkatan */}
            <section>
              <h2 className="font-serif text-xl mb-4 text-primary">Jadwal Keberangkatan</h2>
              <div className="space-y-2 mb-6">
                {jadwalList.map((j) => (
                  <div key={j.id} className="border border-accent rounded-lg p-3 flex justify-between items-center text-[13.5px]">
                    <div>
                      <p className="font-medium text-primary">{new Date(j.tanggal_berangkat).toLocaleDateString('id-ID')}</p>
                      <p className="text-muted-foreground text-[12.5px]">
                        Kuota {j.kuota_tersisa}/{j.kuota_total} · Rp {j.harga_normal.toLocaleString('id-ID')}
                        {j.harga_promo && ` (promo Rp ${j.harga_promo.toLocaleString('id-ID')})`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="size-8 text-secondary-hover" onClick={() => mulaiEditJadwal(j)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => hapusJadwal(j.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {jadwalList.length === 0 && <p className="text-muted-foreground text-[13px]">Belum ada jadwal.</p>}
              </div>

              {/* Form tambah/edit jadwal */}
              <form onSubmit={simpanJadwal} className="border border-accent rounded-lg p-4 space-y-3">
                <h3 className="font-serif text-lg text-primary">{editJadwalId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date" required
                    value={formJadwal.tanggal_berangkat}
                    onChange={(e) => setFormJadwal({ ...formJadwal, tanggal_berangkat: e.target.value })}
                  />
                  <Input
                    type="number" placeholder="Durasi (hari)"
                    value={formJadwal.durasi_hari}
                    onChange={(e) => setFormJadwal({ ...formJadwal, durasi_hari: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Lokasi keberangkatan (Pekalongan, dll)"
                  value={formJadwal.lokasi_keberangkatan}
                  onChange={(e) => setFormJadwal({ ...formJadwal, lokasi_keberangkatan: e.target.value })}
                />
                <Select value={formJadwal.maskapai_id} onValueChange={(v) => setFormJadwal({ ...formJadwal, maskapai_id: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pilih maskapai" /></SelectTrigger>
                  <SelectContent>
                    {maskapaiList.map((m) => <SelectItem key={m.id} value={m.id}>{m.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={formJadwal.hotel_mekkah_id} onValueChange={(v) => setFormJadwal({ ...formJadwal, hotel_mekkah_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Hotel Mekkah" /></SelectTrigger>
                    <SelectContent>
                      {hotelList.filter(h => h.kota === 'mekkah').map((h) => <SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={formJadwal.hotel_madinah_id} onValueChange={(v) => setFormJadwal({ ...formJadwal, hotel_madinah_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Hotel Madinah" /></SelectTrigger>
                    <SelectContent>
                      {hotelList.filter(h => h.kota === 'madinah').map((h) => <SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number" required placeholder="Harga normal"
                    value={formJadwal.harga_normal}
                    onChange={(e) => setFormJadwal({ ...formJadwal, harga_normal: e.target.value })}
                  />
                  <Input
                    type="number" placeholder="Harga promo (opsional)"
                    value={formJadwal.harga_promo}
                    onChange={(e) => setFormJadwal({ ...formJadwal, harga_promo: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number" required placeholder="Kuota total"
                    value={formJadwal.kuota_total}
                    onChange={(e) => setFormJadwal({ ...formJadwal, kuota_total: e.target.value })}
                  />
                  <Input
                    type="number" required placeholder="Kuota tersisa"
                    value={formJadwal.kuota_tersisa}
                    onChange={(e) => setFormJadwal({ ...formJadwal, kuota_tersisa: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="secondary">
                    {editJadwalId ? 'Update Jadwal' : 'Tambah Jadwal'}
                  </Button>
                  {editJadwalId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setEditJadwalId(null); setFormJadwal(KOSONG_JADWAL) }}
                    >
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </section>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
