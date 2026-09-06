'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Keberangkatan } from '@/lib/supabase'
import PhotoBlock from '@/components/PhotoBlock'
import { formatRupiah, formatRupiahSingkat, formatTanggal } from '@/lib/utils'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Hotel as HotelIcon,
  Plane,
  ExternalLink,
  Menu,
} from 'lucide-react'

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
        Sisa {k.kuota_tersisa}
      </Badge>
    )
  return (
    <Badge variant="soft" className="normal-case tracking-normal font-medium text-[11px]">
      Tersedia
    </Badge>
  )
}

export default function PaketTableRow({ k }: { k: Keberangkatan }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const logoSrc = getMaskapaiLogo(k.maskapai)
  const mekkahUrl = getHotelMapsUrl(k.hotel_mekkah, 'Mekkah')
  const madinahUrl = getHotelMapsUrl(k.hotel_madinah, 'Madinah')

  const handleRowClick = (e: React.MouseEvent) => {
    // Hanya picu toggle jika mobile
    if (window.innerWidth < 768) {
      const target = e.target as HTMLElement
      if (target.closest('a')) return
      if (target.closest('button')) return // biar tombol tangani sendiri
      setPopupOpen((prev) => !prev)
    }
  }

  return (
    <TableRow 
      onClick={handleRowClick}
      className="border-white/40 hover:bg-white/40 md:cursor-default cursor-pointer select-none"
    >
      {/* Nama Paket — 30% di mobile (table-fixed), auto di desktop */}
      <TableCell className="w-[30%] md:w-auto pl-3 md:pl-6 whitespace-normal overflow-hidden">
        <div className="flex items-start gap-2 md:gap-4 min-w-0">
          <div className="hidden md:block w-16 h-16 rounded overflow-hidden shrink-0 border border-white/60">
            <PhotoBlock
              imageUrl={k.paket?.gambar_url}
              alt={k.paket?.nama_paket ?? ''}
              className="w-full h-full"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[12px] md:text-[14px] font-semibold text-primary mb-1 leading-snug line-clamp-2 break-words">
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

      {/* Keberangkatan — 30% di mobile (table-fixed), auto di desktop */}
      <TableCell className="w-[30%] md:w-auto whitespace-normal overflow-hidden">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] md:text-[14px] font-semibold text-primary leading-tight">
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

      {/* Harga — 30% di mobile (table-fixed), auto di desktop */}
      <TableCell className="w-[30%] md:w-auto text-right whitespace-nowrap overflow-hidden">
        {k.harga_promo && (
          <div className="text-[10px] md:text-[11.5px] text-muted-foreground line-through">
            <span className="md:hidden">
              {formatRupiahSingkat(k.harga_normal)}
            </span>
            <span className="hidden md:inline">
              {formatRupiah(k.harga_normal)}
            </span>
          </div>
        )}
        <div className="font-serif text-[11px] md:text-[16px] font-bold text-secondary-hover">
          <span className="md:hidden">
            {formatRupiahSingkat(k.harga_promo ?? k.harga_normal)}
          </span>
          <span className="hidden md:inline">
            {formatRupiah(k.harga_promo ?? k.harga_normal)}
          </span>
        </div>
      </TableCell>

      {/* Aksi (hidden on mobile — Detail shown via popover trigger) */}
      <TableCell className="hidden md:table-cell pr-6 text-center">
        <Button asChild size="sm" className="rounded">
          <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail</Link>
        </Button>
      </TableCell>

      {/* Toggle Popover Button (mobile only) */}
      <Popover open={popupOpen} onOpenChange={setPopupOpen}>
        <PopoverAnchor asChild>
          <TableCell className="md:hidden w-10 min-w-[40px] px-1 text-center align-middle">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-white/30 text-muted-foreground transition-colors inline-flex items-center justify-center cursor-pointer"
              aria-label="Lihat detail paket"
              onClick={(e) => {
                e.stopPropagation()
                setPopupOpen((prev) => !prev)
              }}
            >
              <Menu className="size-4" aria-hidden />
            </button>
          </TableCell>
        </PopoverAnchor>
        <PopoverContent align="end" side="left" sideOffset={8} className="w-full max-w-[240px] p-0 overflow-hidden shadow-2xl border border-white/20 bg-background/95 backdrop-blur-md z-[1300]">
          <div className="px-3 py-2.5 border-b border-accent/30 bg-primary/5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
              Detail Cepat
            </p>
            <p className="text-[12px] font-semibold text-primary line-clamp-2 leading-snug">
              {k.paket?.nama_paket}
            </p>
          </div>
          <div className="px-3 py-2.5 space-y-2.5">
            {/* Maskapai */}
            {k.maskapai && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Maskapai
                </p>
                <div className="flex items-center gap-2 min-h-[24px]">
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
                  <span className="truncate">{k.hotel_mekkah.nama}</span>
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
                  <span className="truncate">{k.hotel_madinah.nama}</span>
                  <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden />
                </a>
              </div>
            )}

            {/* Detail Button */}
            <div className="pt-1">
              <Button asChild size="sm" className="rounded w-full">
                <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>Detail →</Link>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableRow>
  )
}