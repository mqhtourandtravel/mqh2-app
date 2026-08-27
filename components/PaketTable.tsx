import Link from 'next/link'
import { Keberangkatan } from '@/lib/supabase'
import PhotoBlock from '@/components/PhotoBlock'
import { formatRupiah, formatTanggal } from '@/lib/utils'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hotel, Plane, Calendar, ArrowRight } from 'lucide-react'

function KuotaBadge({ k }: { k: Keberangkatan }) {
  if (k.status === 'penuh')
    return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 text-[10.5px] font-semibold tracking-normal normal-case">Waiting List</Badge>
  if (k.status === 'terbatas')
    return <Badge variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200 text-[10.5px] font-semibold tracking-normal normal-case">Sisa {k.kuota_tersisa} Seat</Badge>
  return <Badge variant="soft" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10.5px] font-semibold tracking-normal normal-case">Tersedia</Badge>
}

export default function PaketTable({ data }: { data: Keberangkatan[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm py-12 text-center">Tidak ada jadwal keberangkatan yang cocok.</p>
  }

  return (
    <div className="w-full">
      {/* 1. MOBILE VIEW (< md): Card List Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((k) => {
          const hargaFinal = k.harga_promo ?? k.harga_normal
          const paketData = k.paket

          return (
            <div
              key={k.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              {/* Header: Thumbnail + Name + Badge */}
              <div className="flex gap-3 items-start">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative bg-gray-100">
                  <PhotoBlock
                    imageUrl={paketData?.gambar_url}
                    alt={paketData?.nama_paket ?? ''}
                    className="w-full h-full object-cover"
                    sizes="80px"
                  />
                  {k.durasi_hari && (
                    <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded">
                      {k.durasi_hari}H
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {paketData?.kategori ?? 'Umroh'}
                    </span>
                    <KuotaBadge k={k} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {paketData?.nama_paket}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11.5px] text-gray-600 font-medium">
                    <Calendar className="size-3.5 text-emerald-700 shrink-0" />
                    <span>{formatTanggal(k.tanggal_berangkat)}</span>
                  </div>
                </div>
              </div>

              {/* Facilities info */}
              <div className="bg-gray-50/80 rounded-xl p-2.5 text-[11.5px] space-y-1.5 border border-gray-100 text-gray-600">
                <div className="flex items-center gap-2">
                  <Plane className="size-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate font-medium">{k.maskapai?.nama ?? 'Penerbangan Direct'}</span>
                </div>
                {(k.hotel_mekkah?.nama || k.hotel_madinah?.nama) && (
                  <div className="flex items-start gap-2">
                    <Hotel className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="truncate space-x-1 font-medium">
                      {k.hotel_mekkah?.nama && <span>Mekkah: {k.hotel_mekkah.nama}</span>}
                      {k.hotel_mekkah?.nama && k.hotel_madinah?.nama && <span>•</span>}
                      {k.hotel_madinah?.nama && <span>Madinah: {k.hotel_madinah.nama}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Price & CTA Button */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <div>
                  {k.harga_promo && (
                    <span className="text-[11px] text-gray-400 line-through block leading-tight">
                      {formatRupiah(k.harga_normal)}
                    </span>
                  )}
                  <div className="font-serif text-base font-bold text-amber-700">
                    {formatRupiah(hargaFinal)}
                  </div>
                </div>
                <Button asChild size="sm" className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold px-4 gap-1">
                  <Link href={`/paket/${paketData?.slug}?jadwal=${k.id}`}>
                    Detail <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 2. DESKTOP VIEW (>= md): Full Table Layout */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden shadow-none border border-gray-200/80">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 bg-gray-50/50 hover:bg-transparent">
              <TableHead className="pl-6 text-xs font-bold text-gray-600">Nama Paket</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Keberangkatan</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Maskapai</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Hotel</TableHead>
              <TableHead className="text-right text-xs font-bold text-gray-600">Harga</TableHead>
              <TableHead className="text-center pr-6 text-xs font-bold text-gray-600">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {data.map((k) => (
              <TableRow key={k.id} className="hover:bg-emerald-50/20 transition-colors">
                <TableCell className="pl-6 py-4 whitespace-normal">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                      <PhotoBlock
                        imageUrl={k.paket?.gambar_url}
                        alt={k.paket?.nama_paket ?? ''}
                        className="w-full h-full object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[13.5px] font-bold text-gray-900 leading-snug">{k.paket?.nama_paket}</h3>
                      {k.durasi_hari && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          {k.durasi_hari} Hari
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4 whitespace-normal">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-900">
                      {formatTanggal(k.tanggal_berangkat)}
                    </span>
                    <div>
                      <KuotaBadge k={k} />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4 whitespace-normal">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                    <Plane className="size-3.5 text-emerald-700 shrink-0" />
                    <span>{k.maskapai?.nama ?? '—'}</span>
                  </div>
                </TableCell>

                <TableCell className="py-4 whitespace-normal">
                  <div className="flex flex-col gap-1 text-[11.5px] text-gray-600">
                    {k.hotel_mekkah?.nama && (
                      <div className="flex items-center gap-1.5">
                        <Hotel className="size-3 text-amber-600 shrink-0" />
                        <span className="font-medium truncate max-w-[140px]">Mekkah: {k.hotel_mekkah.nama}</span>
                      </div>
                    )}
                    {k.hotel_madinah?.nama && (
                      <div className="flex items-center gap-1.5">
                        <Hotel className="size-3 text-amber-600 shrink-0" />
                        <span className="font-medium truncate max-w-[140px]">Madinah: {k.hotel_madinah.nama}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right py-4 whitespace-normal">
                  {k.harga_promo && (
                    <div className="text-[11px] text-gray-400 line-through">{formatRupiah(k.harga_normal)}</div>
                  )}
                  <div className="font-serif text-[15px] font-bold text-amber-700">{formatRupiah(k.harga_promo ?? k.harga_normal)}</div>
                </TableCell>

                <TableCell className="pr-6 py-4 text-center">
                  <Button asChild size="sm" className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold px-3.5">
                    <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
