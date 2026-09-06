import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NOMOR_WA } from '@/lib/config'

// Dipakai oleh semua komponen shadcn/ui untuk gabungkan class Tailwind
// dengan aman (menghindari konflik class yang bertabrakan)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Satu-satunya sumber format Rupiah di seluruh app. Sebelumnya fungsi ini
// diduplikasi terpisah di PaketCard, PaketTable, dan app/paket/[slug]/page.tsx
// — sekarang semua import dari sini biar konsisten kalau formatnya berubah.
export function formatRupiah(n?: number | null): string {
  const num = n ?? 0
  if (!Number.isFinite(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Format ringkas khusus mobile (contoh: 38.600.000 -> 38,6jt)
export function formatRupiahSingkat(n?: number | null): string {
  const num = n ?? 0
  if (!Number.isFinite(num) || num === 0) return '0'
  if (num >= 1_000_000_000) {
    const m = (num / 1_000_000_000).toFixed(1).replace('.', ',').replace(',0', '')
    return `${m}M`
  }
  if (num >= 1_000_000) {
    const jt = (num / 1_000_000).toFixed(1).replace('.', ',').replace(',0', '')
    return `${jt}jt`
  }
  if (num >= 1_000) {
    const rb = (num / 1_000).toFixed(0)
    return `${rb}rb`
  }
  return String(num)
}

export function formatTanggal(dateStr?: string | Date | null): string {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

// Link WA generik dengan pesan bebas — dipakai untuk CTA yang bukan booking paket
// (kontak, tabungan umroh, partnership, dll). NOMOR_WA satu sumber dari lib/config.ts.
export function waLink(pesan: string): string {
  return `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`
}

export function linkWhatsApp(namaPaket: string, tanggal?: string): string {
  return waLink(
    `Assalamualaikum, saya ingin booking/info detail paket ${namaPaket}${tanggal ? ` (keberangkatan ${tanggal})` : ''}`
  )
}

export function buatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}