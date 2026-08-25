import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Maskapai = {
  id: string
  nama: string
  logo_url: string | null
}

export type Hotel = {
  id: string
  nama: string
  kota: 'mekkah' | 'madinah'
  google_maps_url: string | null
}

export type Paket = {
  id: string
  slug: string
  nama_paket: string
  kategori: 'umroh' | 'haji' | 'badal' | 'tour'
  tier: string | null
  deskripsi: string | null
  gambar_url: string | null
  status: 'aktif' | 'nonaktif'
  urutan: number
}

export type Artikel = {
  id: string
  slug: string
  judul: string
  ringkasan: string | null
  konten: string
  kategori: string | null
  gambar_url: string | null
  status: 'draft' | 'terbit'
  diterbitkan_pada: string
}

export type PaketGaleri = {
  id: string
  paket_id: string
  gambar_url: string
  urutan: number
}

export type ItineraryItem = {
  id: string
  paket_id: string
  hari_ke: number
  judul: string
  deskripsi: string | null
  urutan: number
}

export type TipeKamar = {
  id: string
  keberangkatan_id: string
  nama_tipe: string
  kapasitas_orang: number
  harga_tambahan: number
  urutan: number
}

export type Keberangkatan = {
  id: string
  paket_id: string
  tanggal_berangkat: string
  durasi_hari: number | null
  lokasi_keberangkatan: string | null
  maskapai_id: string | null
  hotel_mekkah_id: string | null
  hotel_madinah_id: string | null
  harga_normal: number
  harga_promo: number | null
  kuota_total: number
  kuota_tersisa: number
  status: 'tersedia' | 'terbatas' | 'penuh' | 'ditutup'
  paket?: Paket
  maskapai?: Maskapai
  hotel_mekkah?: Hotel
  hotel_madinah?: Hotel
}
