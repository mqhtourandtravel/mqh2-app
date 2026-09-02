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
import { Hotel, Plane } from 'lucide-react'

function KuotaBadge({ k }: { k: Keberangkatan }) {
  if (k.status === 'penuh')
    return <Badge variant="destructive" className="bg-destructive/10 text-destructive normal-case tracking-normal font-medium text-[11px]">Waiting List</Badge>
  if (k.status === 'terbatas')
    return <Badge variant="destructive" className="bg-destructive/10 text-destructive normal-case tracking-normal font-medium text-[11px]">Sisa {k.kuota_tersisa} Seat</Badge>
  return <Badge variant="soft" className="normal-case tracking-normal font-medium text-[11px]">Tersedia</Badge>
}

export default function PaketTable({ data }: { data: Keberangkatan[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm py-12 text-center">Tidak ada jadwal keberangkatan yang cocok.</p>
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-none border border-white/40">
      {/* Scrollable Container on Mobile */}
      <div className="overflow-x-auto w-full scrollbar-thin">
        <Table className="min-w-[720px] w-full">
          <TableHeader>
            <TableRow className="border-white/60 hover:bg-transparent">
              <TableHead className="pl-6 whitespace-nowrap">Nama Paket</TableHead>
              <TableHead className="whitespace-nowrap">Keberangkatan</TableHead>
              <TableHead className="whitespace-nowrap">Maskapai</TableHead>
              <TableHead className="whitespace-nowrap">Hotel</TableHead>
              <TableHead className="text-right whitespace-nowrap">Harga</TableHead>
              <TableHead className="text-center pr-6 whitespace-nowrap">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((k) => (
              <TableRow key={k.id} className="border-white/40 hover:bg-white/40">
                <TableCell className="pl-6 whitespace-normal">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden shrink-0 hidden md:block border border-white/60">
                      <PhotoBlock imageUrl={k.paket?.gambar_url} alt={k.paket?.nama_paket ?? ''} className="w-full h-full" sizes="64px" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-primary mb-1">{k.paket?.nama_paket}</h3>
                      {k.durasi_hari && (
                        <Badge variant="outline" className="bg-info/70 text-info-foreground border-transparent normal-case tracking-normal font-semibold rounded text-[11px]">{k.durasi_hari} Hari</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-normal">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold text-primary">
                      {formatTanggal(k.tanggal_berangkat)}
                    </span>
                    <KuotaBadge k={k} />
                  </div>
                </TableCell>

                <TableCell className="whitespace-normal">
                  <div className="flex items-center gap-2">
                    <Plane className="text-muted-foreground text-[18px] shrink-0" aria-hidden="true" />
                    <span className="text-[13px] text-muted-foreground font-medium">{k.maskapai?.nama ?? '—'}</span>
                  </div>
                </TableCell>

                <TableCell className="whitespace-normal">
                  <div className="flex flex-col gap-1">
                    {k.hotel_mekkah?.nama && (
                      <div className="flex items-center gap-2">
                        <Hotel className="text-secondary text-[15px] shrink-0" aria-hidden="true" />
                        <span className="text-[11.5px] text-muted-foreground font-medium">Mekkah: {k.hotel_mekkah.nama}</span>
                      </div>
                    )}
                    {k.hotel_madinah?.nama && (
                      <div className="flex items-center gap-2">
                        <Hotel className="text-secondary text-[15px] shrink-0" aria-hidden="true" />
                        <span className="text-[11.5px] text-muted-foreground font-medium">Madinah: {k.hotel_madinah.nama}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right whitespace-normal">
                  {k.harga_promo && (
                    <div className="text-[11.5px] text-muted-foreground line-through">{formatRupiah(k.harga_normal)}</div>
                  )}
                  <div className="font-serif text-[16px] font-bold text-secondary-hover">{formatRupiah(k.harga_promo ?? k.harga_normal)}</div>
                </TableCell>

                <TableCell className="pr-6 text-center">
                  <Button asChild size="sm" className="rounded">
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
