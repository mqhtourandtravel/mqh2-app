import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
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
import { Hotel as HotelIcon, Plane, ExternalLink } from 'lucide-react'

// ─── Maskapai logo mapping ──────────────────────────────────────────────────
// Prioritas: DB logo_url → mapping lokal → null (fallback teks + ikon Plane)
const MASKAPAI_LOGO_MAP: Record<string, string> = {
  'Saudi Airlines':   '/images/logos/saudia.svg',
  'Saudia':           '/images/logos/saudia.svg',
  'Garuda Indonesia': '/images/logos/garuda-indonesia.svg',
  'Etihad Airways':   '/images/logos/etihad.svg',
}

function getMaskapaiLogo(m?: { nama: string; logo_url: string | null } | null): string | null {
  return m?.logo_url ?? MASKAPAI_LOGO_MAP[m?.nama ?? ''] ?? null
}

// ─── Hotel Google Maps URL ──────────────────────────────────────────────────
// Prioritas: DB google_maps_url → auto-generate search URL sebagai fallback
function getHotelMapsUrl(h?: { nama: string; google_maps_url: string | null } | null): string | null {
  if (!h) return null
  return h.google_maps_url ?? `https://maps.google.com/?q=${encodeURIComponent(h.nama)}`
}

// ─── Grouping per bulan ─────────────────────────────────────────────────────
function groupByBulan(data: Keberangkatan[]): { label: string; items: Keberangkatan[] }[] {
  const map = new Map<string, Keberangkatan[]>()
  for (const k of data) {
    const label = new Date(k.tanggal_berangkat).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })
    const group = map.get(label)
    if (group) group.push(k)
    else map.set(label, [k])
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

// ─── KuotaBadge ────────────────────────────────────────────────────────────
function KuotaBadge({ k }: { k: Keberangkatan }) {
  if (k.status === 'penuh')
    return (
      <Badge variant="destructive" className="bg-destructive/10 text-destructive normal-case tracking-normal font-medium text-[11px]">
        Waiting List
      </Badge>
    )
  if (k.status === 'terbatas')
    return (
      <Badge variant="destructive" className="bg-destructive/10 text-destructive normal-case tracking-normal font-medium text-[11px]">
        Sisa {k.kuota_tersisa} Seat
      </Badge>
    )
  return (
    <Badge variant="soft" className="normal-case tracking-normal font-medium text-[11px]">
      Tersedia
    </Badge>
  )
}

// ─── Mobile Card ────────────────────────────────────────────────────────────
function PaketCard({ k }: { k: Keberangkatan }) {
  const logoSrc = getMaskapaiLogo(k.maskapai)
  const mekkahUrl = getHotelMapsUrl(k.hotel_mekkah)
  const madinahUrl = getHotelMapsUrl(k.hotel_madinah)

  return (
    <div className="p-4 space-y-3">
      {/* Header: gambar + nama paket + badge durasi */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/40">
          <PhotoBlock
            imageUrl={k.paket?.gambar_url}
            alt={k.paket?.nama_paket ?? ''}
            className="w-full h-full"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-primary leading-snug mb-1.5">
            {k.paket?.nama_paket}
          </h3>
          {k.durasi_hari && (
            <Badge
              variant="outline"
              className="bg-info/70 text-info-foreground border-transparent normal-case tracking-normal font-semibold rounded text-[11px]"
            >
              {k.durasi_hari} Hari
            </Badge>
          )}
        </div>
      </div>

      {/* Tanggal + Kuota */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[13px] font-semibold text-primary">
          {formatTanggal(k.tanggal_berangkat)}
        </span>
        <KuotaBadge k={k} />
      </div>

      {/* Maskapai */}
      {k.maskapai && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Maskapai
          </p>
          <div className="flex items-center gap-2">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={k.maskapai.nama}
                width={72}
                height={24}
                className="h-6 w-auto object-contain"
              />
            ) : (
              <>
                <Plane className="size-4 text-muted-foreground shrink-0" aria-hidden />
                <span className="text-[13px] font-medium text-foreground">{k.maskapai.nama}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hotel Mekkah */}
      {k.hotel_mekkah && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Hotel Mekkah
          </p>
          <a
            href={mekkahUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-secondary transition-colors group"
          >
            <HotelIcon className="size-3.5 text-secondary shrink-0" aria-hidden />
            <span>{k.hotel_mekkah.nama}</span>
            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden />
          </a>
        </div>
      )}

      {/* Hotel Madinah */}
      {k.hotel_madinah && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Hotel Madinah
          </p>
          <a
            href={madinahUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-secondary transition-colors group"
          >
            <HotelIcon className="size-3.5 text-secondary shrink-0" aria-hidden />
            <span>{k.hotel_madinah.nama}</span>
            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden />
          </a>
        </div>
      )}

      {/* Harga + Tombol Detail */}
      <div className="flex items-end justify-between pt-2 border-t border-white/30">
        <div>
          {k.harga_promo && (
            <div className="text-[11px] text-muted-foreground line-through">
              {formatRupiah(k.harga_normal)}
            </div>
          )}
          <div className="font-serif text-[17px] font-bold text-secondary-hover">
            {formatRupiah(k.harga_promo ?? k.harga_normal)}
          </div>
        </div>
        <Button asChild size="sm" className="rounded shrink-0">
          <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail →</Link>
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PaketTable({
  data,
  hasFilter = false,
}: {
  data: Keberangkatan[]
  hasFilter?: boolean
}) {
  if (data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-10 text-center border border-white/40">
        <p className="text-muted-foreground text-sm mb-4">
          Tidak ada jadwal keberangkatan yang cocok dengan filter yang dipilih.
        </p>
        {hasFilter && (
          <Button asChild variant="outline" size="sm" className="rounded">
            <Link href="/#paket">Reset Filter</Link>
          </Button>
        )}
      </div>
    )
  }

  const grouped = groupByBulan(data)

  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-none border border-white/40">

      {/* ── MOBILE: Card stack (hanya tampil di bawah md) ──────────────────────── */}
      <div className="md:hidden">
        {grouped.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary px-4 pt-4 pb-2 border-b border-white/10">
              {label}
            </p>
            {items.map((k, i) => (
              <div key={k.id} className={i > 0 ? 'border-t border-white/10' : ''}>
                <PaketCard k={k} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── DESKTOP: Table (hanya tampil di md ke atas) ────────────────────────── */}
      <div className="hidden md:block">
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
            {grouped.map(({ label, items }) => (
              <React.Fragment key={label}>
                {/* Bulan separator row */}
                <TableRow className="bg-primary/5 border-y border-primary/20 hover:bg-primary/5">
                  <TableCell
                    colSpan={6}
                    className="py-2 pl-6 text-[10px] font-bold uppercase tracking-widest text-secondary"
                  >
                    {label}
                  </TableCell>
                </TableRow>

                {/* Data rows */}
                {items.map(k => {
                  const logoSrc = getMaskapaiLogo(k.maskapai)
                  const mekkahUrl = getHotelMapsUrl(k.hotel_mekkah)
                  const madinahUrl = getHotelMapsUrl(k.hotel_madinah)

                  return (
                    <TableRow key={k.id} className="border-white/40 hover:bg-white/40">
                      {/* Nama Paket */}
                      <TableCell className="pl-6 whitespace-normal">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded overflow-hidden shrink-0 border border-white/60">
                            <PhotoBlock
                              imageUrl={k.paket?.gambar_url}
                              alt={k.paket?.nama_paket ?? ''}
                              className="w-full h-full"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <h3 className="text-[14px] font-semibold text-primary mb-1">
                              {k.paket?.nama_paket}
                            </h3>
                            {k.durasi_hari && (
                              <Badge
                                variant="outline"
                                className="bg-info/70 text-info-foreground border-transparent normal-case tracking-normal font-semibold rounded text-[11px]"
                              >
                                {k.durasi_hari} Hari
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Keberangkatan */}
                      <TableCell className="whitespace-normal">
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] font-semibold text-primary">
                            {formatTanggal(k.tanggal_berangkat)}
                          </span>
                          <KuotaBadge k={k} />
                        </div>
                      </TableCell>

                      {/* Maskapai */}
                      <TableCell className="whitespace-normal">
                        {logoSrc ? (
                          <Image
                            src={logoSrc}
                            alt={k.maskapai?.nama ?? ''}
                            width={80}
                            height={28}
                            className="h-7 w-auto object-contain"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Plane className="text-muted-foreground size-[18px] shrink-0" aria-hidden />
                            <span className="text-[13px] text-muted-foreground font-medium">
                              {k.maskapai?.nama ?? '—'}
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Hotel */}
                      <TableCell className="whitespace-normal">
                        <div className="flex flex-col gap-1.5">
                          {k.hotel_mekkah?.nama && (
                            <a
                              href={mekkahUrl!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[11.5px] text-primary font-medium hover:text-secondary transition-colors group"
                            >
                              <HotelIcon className="text-secondary size-[15px] shrink-0" aria-hidden />
                              <span>Mekkah: {k.hotel_mekkah.nama}</span>
                              <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden />
                            </a>
                          )}
                          {k.hotel_madinah?.nama && (
                            <a
                              href={madinahUrl!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[11.5px] text-primary font-medium hover:text-secondary transition-colors group"
                            >
                              <HotelIcon className="text-secondary size-[15px] shrink-0" aria-hidden />
                              <span>Madinah: {k.hotel_madinah.nama}</span>
                              <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden />
                            </a>
                          )}
                          {!k.hotel_mekkah?.nama && !k.hotel_madinah?.nama && (
                            <span className="text-muted-foreground text-[12px]">—</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Harga */}
                      <TableCell className="text-right whitespace-normal">
                        {k.harga_promo && (
                          <div className="text-[11.5px] text-muted-foreground line-through">
                            {formatRupiah(k.harga_normal)}
                          </div>
                        )}
                        <div className="font-serif text-[16px] font-bold text-secondary-hover">
                          {formatRupiah(k.harga_promo ?? k.harga_normal)}
                        </div>
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="pr-6 text-center">
                        <Button asChild size="sm" className="rounded">
                          <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
