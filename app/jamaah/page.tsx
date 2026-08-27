'use client'

import { useEffect, useState } from 'react'
import { supabase, Booking } from '@/lib/supabase'
import { bookingList, bookingUpdateStatus } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Calendar, Package, Loader2 } from 'lucide-react'
import { formatRupiah, formatTanggal } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Dikonfirmasi', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-600' },
  completed: { label: 'Selesai', color: 'bg-blue-100 text-blue-600' },
}

export default function JamaahDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const data = await bookingList<Booking>()
      setBookings(data)
      setLoading(false)
    }
    init()
  }, [router])

  async function handleCancel(id: string) {
    if (!confirm('Yakin ingin membatalkan booking ini?')) return
    setCancellingId(id)
    const { error } = await bookingUpdateStatus(id, 'cancelled')
    if (!error) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b))
    }
    setCancellingId(null)
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled')
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled')

  return (
    <AdminShell>
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary">Booking Saya</h1>
          <Button asChild size="sm">
            <Link href="/jamaah/paket">
              <Package className="size-4 mr-1" /> Booking Baru
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{activeBookings.length}</p>
              <p className="text-[12px] text-muted-foreground">Booking Aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{bookings.filter((b) => b.status === 'confirmed').length}</p>
              <p className="text-[12px] text-muted-foreground">Dikonfirmasi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-muted-foreground">{cancelledBookings.length}</p>
              <p className="text-[12px] text-muted-foreground">Dibatalkan</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Bookings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Booking Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            {activeBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">Belum ada booking aktif.</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/jamaah/paket">Lihat Paket Tersedia</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBookings.map((b) => {
                    const ks = STATUS_MAP[b.status] ?? STATUS_MAP.pending
                    return (
                      <TableRow key={b.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-primary text-[13.5px]">
                              {b.keberangkatan?.paket?.nama_paket ?? '-'}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {b.keberangkatan?.paket?.kategori ?? ''}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3 text-muted-foreground" />
                            {b.keberangkatan?.tanggal_berangkat
                              ? formatTanggal(b.keberangkatan.tanggal_berangkat)
                              : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] font-medium">
                          {b.keberangkatan?.harga_promo
                            ? formatRupiah(b.keberangkatan.harga_promo)
                            : b.keberangkatan?.harga_normal
                              ? formatRupiah(b.keberangkatan.harga_normal)
                              : '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${ks.color}`}>
                            {ks.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {b.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 text-[12px]"
                              onClick={() => handleCancel(b.id)}
                              disabled={cancellingId === b.id}
                            >
                              {cancellingId === b.id ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                'Batalkan'
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Cancelled */}
        {cancelledBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground">Riwayat Dibatalkan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelledBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-[13px] text-muted-foreground">
                        {b.keberangkatan?.paket?.nama_paket ?? '-'}
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground">
                        {b.keberangkatan?.tanggal_berangkat
                          ? formatTanggal(b.keberangkatan.tanggal_berangkat)
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                          Dibatalkan
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </AdminShell>
  )
}
