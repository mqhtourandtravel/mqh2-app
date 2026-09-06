'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Keberangkatan } from '@/lib/supabase'
import PhotoBlock from '@/components/PhotoBlock'
import { formatRupiah, formatTanggal } from '@/lib/utils'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hotel as HotelIcon, Plane, ExternalLink, ChevronDown } from 'lucide-react'

// ─── Maskapai logo mapping ──────────────────────────────────────────────────
const MASKAPAI_LOGO_MAP: Record<string, string> = {
  'Saudi Airlines':   '/images/logos/saudia.svg',
  'Saudia':           '/images/logos/saudia.svg',
  'Garuda Indonesia': '/images/logos/garuda-indonesia.svg',
  'Etihad Airways':   '/images/logos/etihad.svg',
}

function getMaskapaiLogo(m?: { nama: string; logo_url: string | null } | null): string | null {
  return m?.logo_url ?? MASKAPAI_LOGO_MAP[m?.nama ?? ''] ?? null
}

function getHotelMapsUrl(
  h?: { nama: string; google_maps_url: string | null } | null,
  kotaDefault?: string
): string | null {
  if (!h) return null
  if (h.google_maps_url) return h.google_maps_url
  const query = kotaDefault ? `${h.nama} ${kotaDefault}` : h.nama
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`
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

// ─── Total columns: 7 on desktop (Nama, Keberangkatan, Maskapai, Hotel, Harga, Aksi, Toggle)
// Toggle column is md:hidden, Maskapai and Hotel columns are hidden on mobile
const TOTAL_COLS = 7

export default function PaketTableRow({ k }: { k: Keberangkatan }) {
  const [expanded, setExpanded] = useState(false)
  const logoSrc = getMaskapaiLogo(k.maskapai)
  const mekkahUrl = getHotelMapsUrl(k.hotel_mekkah, 'Mekkah')
  const madinahUrl = getHotelMapsUrl(k.hotel_madinah, 'Madinah')

  return (
    <>
      {/* ── Main Row ──────────────────────────────────────────────────── */}
      <TableRow className="border-white/40 hover:bg-white/40">
        {/* Toggle (mobile only) */}
        <TableCell className="md:hidden w-10 px-2 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-md hover:bg-white/30 transition-colors"
            aria-label={expanded ? 'Tutup detail' : 'Lihat detail'}
            aria-expanded={expanded}
          >
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </TableCell>

        {/* Nama Paket */}
        <TableCell className="pl-3 md:pl-6 whitespace-normal">
          <div className="flex items-start gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded overflow-hidden shrink-0 border border-white/60">
              <PhotoBlock
                imageUrl={k.paket?.gambar_url}
                alt={k.paket?.nama_paket ?? ''}
                className="w-full h-full"
                sizes="64px"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-[12px] md:text-[14px] font-semibold text-primary mb-1 leading-snug">
                {k.paket?.nama_paket}
              </h3>
              {k.durasi_hari && (
                <Badge
                  variant="outline"
                  className="bg-info/70 text-info-foreground border-transparent normal-case tracking-normal font-semibold rounded text-[10px] md:text-[11px]"
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
            <span className="text-[12px] md:text-[14px] font-semibold text-primary">
              {formatTanggal(k.tanggal_berangkat)}
            </span>
            <KuotaBadge k={k} />
          </div>
        </TableCell>

        {/* Maskapai (hidden on mobile) */}
        <TableCell className="hidden md:table-cell whitespace-normal">
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

        {/* Hotel (hidden on mobile) */}
        <TableCell className="hidden md:table-cell whitespace-normal">
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
            <div className="text-[10px] md:text-[11.5px] text-muted-foreground line-through">
              {formatRupiah(k.harga_normal)}
            </div>
          )}
          <div className="font-serif text-[14px] md:text-[16px] font-bold text-secondary-hover">
            {formatRupiah(k.harga_promo ?? k.harga_normal)}
          </div>
        </TableCell>

        {/* Aksi (hidden on mobile — shown in expand row instead) */}
        <TableCell className="hidden md:table-cell pr-6 text-center">
          <Button asChild size="sm" className="rounded">
            <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail</Link>
          </Button>
        </TableCell>
      </TableRow>

      {/* ── Expanded Sub-Row (mobile only) ────────────────────────────── */}
      {expanded && (
        <TableRow className="md:hidden border-white/20 bg-white/20">
          <TableCell colSpan={TOTAL_COLS} className="px-4 py-3">
            <div className="space-y-3">
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

              {/* Detail Button */}
              <div className="pt-2">
                <Button asChild size="sm" className="rounded w-full">
                  <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail →</Link>
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
