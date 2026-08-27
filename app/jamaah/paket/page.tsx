'use client'

import { useEffect, useState } from 'react'
import { supabase, Keberangkatan } from '@/lib/supabase'
import { bookingCreate } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Calendar, MapPin, Plane, Loader2 } from 'lucide-react'
import { formatRupiah, formatTanggal } from '@/lib/utils'

export default function JamaahPaket() {
  const router = useRouter()
  const [jadwal, setJadwal] = useState<Keberangkatan[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      // Fetch jadwal from public API
      const res = await fetch('/api/paket?per_page=50')
      const json = await res.json()
      setJadwal(json.items ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  async function handleBook(keberangkatanId: string) {
    if (!confirm('Yakin ingin booking jadwal ini?')) return
    setBookingId(keberangkatanId)
    setError('')
    setSuccess('')

    const { error: err } = await bookingCreate(keberangkatanId)
    if (err) {
      setError(err)
    } else {
      setSuccess('Booking berhasil! Menunggu konfirmasi dari admin.')
      // Update kuota locally
      setJadwal((prev) => prev.map((k) =>
        k.id === keberangkatanId
          ? { ...k, kuota_tersisa: Math.max(0, k.kuota_tersisa - 1) }
          : k,
      ))
      setTimeout(() => setSuccess(''), 5000)
    }
    setBookingId(null)
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">Jadwal Tersedia</h1>
            <p className="text-sm text-muted-foreground mt-1">Pilih jadwal keberangkatan untuk booking</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/jamaah">Kembali ke Dashboard</Link>
          </Button>
        </div>

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/20">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-0">
            {jadwal.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada jadwal tersedia.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Maskapai</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Kuota</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jadwal.map((k) => (
                    <TableRow key={k.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-primary text-[13.5px]">{k.nama_paket ?? '-'}</p>
                          <p className="text-[11px] text-muted-foreground">{k.tipe_paket ?? ''}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3 text-muted-foreground" />
                          {formatTanggal(k.tanggal_berangkat)}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{k.durasi_hari} hari</p>
                      </TableCell>
                      <TableCell className="text-[13px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground" />
                          {k.kota_asal ?? '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px]">
                        <div className="flex items-center gap-1">
                          <Plane className="size-3 text-muted-foreground" />
                          {typeof k.maskapai === 'string' ? k.maskapai : k.maskapai?.nama ?? '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px] font-medium">
                        {k.harga_promo ? (
                          <div>
                            <span className="text-green-600">{formatRupiah(k.harga_promo)}</span>
                            <span className="text-[11px] text-muted-foreground line-through ml-1">{formatRupiah(k.harga_normal)}</span>
                          </div>
                        ) : (
                          formatRupiah(k.harga_normal)
                        )}
                      </TableCell>
                      <TableCell>
                        {k.sisa_kuota == null ? (
                          <Badge variant="soft">Tersedia</Badge>
                        ) : k.sisa_kuota > 5 ? (
                          <Badge variant="soft" className="bg-green-100 text-green-700">{k.sisa_kuota} tersisa</Badge>
                        ) : k.sisa_kuota > 0 ? (
                          <Badge variant="soft" className="bg-yellow-100 text-yellow-700">{k.sisa_kuota} tersisa</Badge>
                        ) : (
                          <Badge variant="soft" className="bg-red-100 text-red-600">Penuh</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleBook(k.id)}
                          disabled={bookingId === k.id || k.sisa_kuota === 0}
                        >
                          {bookingId === k.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : k.sisa_kuota === 0 ? (
                            'Penuh'
                          ) : (
                            'Booking'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
