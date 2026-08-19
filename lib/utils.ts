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
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatTanggal(dateStr?: string | null): string {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
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
}