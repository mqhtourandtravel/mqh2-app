import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'
import type {
  Paket, Keberangkatan, Cabang, Testimoni, Artikel, TentangKami, Maskapai, Hotel,
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
function toKeberangkatan(row: any): Keberangkatan {
  return keysToSnake(row) as Keberangkatan
}

export async function getKeberangkatanAktif(opts: {
  limit?: number
  lokasi?: string
  durasiHari?: number
} = {}): Promise<Keberangkatan[]> {
  const rows = await prisma.keberangkatan.findMany({
    where: {
      status: { not: 'ditutup' },
      ...(opts.lokasi ? { lokasiKeberangkatan: opts.lokasi } : {}),
      ...(opts.durasiHari ? { durasiHari: opts.durasiHari } : {}),
    },
    include: includeKeberangkatan,
    orderBy: { tanggalBerangkat: 'asc' },
    ...(opts.limit ? { take: opts.limit } : {}),
  })
  return rows.map(toKeberangkatan)
}

export async function getKeberangkatanByPaketId(paketId: string): Promise<Keberangkatan[]> {
  const rows = await prisma.keberangkatan.findMany({
    where: { paketId, status: { not: 'ditutup' } },
    include: includeKeberangkatan,
    orderBy: { tanggalBerangkat: 'asc' },
  })
  return rows.map(toKeberangkatan)
}

export async function getMaskapaiList(): Promise<Maskapai[]> {
  const rows = await prisma.maskapai.findMany()
  return rows.map((r) => keysToSnake(r) as Maskapai)
}

export async function getHotelList(): Promise<Hotel[]> {
  const rows = await prisma.hotel.findMany()
  return rows.map((r) => keysToSnake(r) as Hotel)
}

export async function getArtikelTerbit(opts: { limit?: number } = {}): Promise<Artikel[]> {
  const rows = await prisma.artikel.findMany({
    where: { status: 'terbit' },
    orderBy: { diterbitkanPada: 'desc' },
    ...(opts.limit ? { take: opts.limit } : {}),
  })
  return rows.map((r) => keysToSnake(r) as Artikel)
}

export async function getArtikelBySlug(slug: string): Promise<Artikel | null> {
  const row = await prisma.artikel.findFirst({ where: { slug, status: 'terbit' } })
  return row ? (keysToSnake(row) as Artikel) : null
}

export async function getPaketBySlug(slug: string): Promise<Paket | null> {
  const row = await prisma.paket.findUnique({ where: { slug } })
  return row ? (keysToSnake(row) as Paket) : null
}

export async function getCabangAktif(): Promise<Cabang[]> {
  const rows = await prisma.cabang.findMany({ where: { status: 'aktif' }, orderBy: { urutan: 'asc' } })
  return rows.map((r) => keysToSnake(r) as Cabang)
}

export async function getTentangKami(): Promise<TentangKami | null> {
  const row = await prisma.tentangKami.findFirst()
  return row ? (keysToSnake(row) as TentangKami) : null
}
