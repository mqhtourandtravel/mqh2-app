import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'
import type {
  Paket, Keberangkatan, Artikel, Maskapai, Hotel,
} from '@/lib/supabase'

// Semua fungsi di sini pakai Prisma (server-only) dan mengembalikan data dengan
// bentuk field snake_case yang sama seperti sebelumnya (Keberangkatan.paket,
// .maskapai, .hotel_mekkah, .hotel_madinah, tanggal_berangkat, harga_normal, dst).

const includeKeberangkatan = {
  paket: true,
  maskapai: true,
  hotelMekkah: true,
  hotelMadinah: true,
} as const

// keysToSnake mengubah relasi `hotelMekkah` -> `hotel_mekkah` dan
// `hotelMadinah` -> `hotel_madinah` secara otomatis (camel->snake per kata),
// persis sama dengan nama yang dipakai select() Supabase sebelumnya.
function toKeberangkatan(row: Record<string, unknown>): Keberangkatan {
  return keysToSnake(row) as Keberangkatan
}

export async function getKeberangkatanAktif(opts: {
  limit?: number
  lokasi?: string
  durasiHari?: number
} = {}): Promise<Keberangkatan[]> {
  try {
    const rows = await prisma.keberangkatan.findMany({
      where: {
        status: { not: 'ditutup' },
        // Hanya keberangkatan milik paket aktif — konsisten dengan
        // getPaketBySlug (detail paket nonaktif = 404) dan sitemap.
        paket: { is: { status: 'aktif' } },
        ...(opts.lokasi ? { lokasiKeberangkatan: opts.lokasi } : {}),
        ...(opts.durasiHari ? { durasiHari: opts.durasiHari } : {}),
      },
      include: includeKeberangkatan,
      orderBy: { tanggalBerangkat: 'asc' },
      ...(opts.limit ? { take: opts.limit } : {}),
    })
    return rows.map(toKeberangkatan)
  } catch (err) {
    console.error('[queries] getKeberangkatanAktif error:', err)
    return []
  }
}

export async function getKeberangkatanByPaketId(paketId: string): Promise<Keberangkatan[]> {
  try {
    const rows = await prisma.keberangkatan.findMany({
      where: { paketId, status: { not: 'ditutup' } },
      include: includeKeberangkatan,
      orderBy: { tanggalBerangkat: 'asc' },
    })
    return rows.map(toKeberangkatan)
  } catch (err) {
    console.error('[queries] getKeberangkatanByPaketId error:', err)
    return []
  }
}

export async function getMaskapaiList(): Promise<Maskapai[]> {
  try {
    const rows = await prisma.maskapai.findMany()
    return rows.map((r) => keysToSnake(r) as Maskapai)
  } catch (err) {
    console.error('[queries] getMaskapaiList error:', err)
    return []
  }
}

export async function getHotelList(): Promise<Hotel[]> {
  try {
    const rows = await prisma.hotel.findMany()
    return rows.map((r) => keysToSnake(r) as Hotel)
  } catch (err) {
    console.error('[queries] getHotelList error:', err)
    return []
  }
}

export async function getArtikelTerbit(opts: { limit?: number } = {}): Promise<Artikel[]> {
  try {
    const rows = await prisma.artikel.findMany({
      where: { status: 'terbit' },
      orderBy: { diterbitkanPada: 'desc' },
      ...(opts.limit ? { take: opts.limit } : {}),
    })
    return rows.map((r) => keysToSnake(r) as Artikel)
  } catch (err) {
    console.error('[queries] getArtikelTerbit error:', err)
    return []
  }
}

export async function getArtikelBySlug(slug: string): Promise<Artikel | null> {
  try {
    const row = await prisma.artikel.findFirst({ where: { slug, status: 'terbit' } })
    return row ? (keysToSnake(row) as Artikel) : null
  } catch (err) {
    console.error('[queries] getArtikelBySlug error:', err)
    return null
  }
}

export async function getPaketBySlug(slug: string): Promise<Paket | null> {
  try {
    const row = await prisma.paket.findFirst({ where: { slug, status: 'aktif' } })
    return row ? (keysToSnake(row) as Paket) : null
  } catch (err) {
    console.error('[queries] getPaketBySlug error:', err)
    return null
  }
}