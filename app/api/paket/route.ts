import { getKeberangkatanAktif } from '@/lib/queries'
import { NextRequest, NextResponse } from 'next/server'

// Endpoint ini mengikuti kontrak yang diharapkan theme WordPress mqh-tour-travel
// (lihat inc/paket-api.php di theme). Data diambil dari Supabase, lalu di-mapping
// ke bentuk JSON yang persis sesuai kontrak, supaya WordPress tidak perlu diubah
// sama sekali -- cukup isi Base URL ini di Settings > MQH API.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mqh-web.vercel.app'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const bulan = params.get('bulan')     // angka 1-12
  const tipe = params.get('tipe')       // tier, misal "Reguler"
  const kota = params.get('kota')       // lokasi_keberangkatan
  const durasi = params.get('durasi')   // durasi_hari
  const page = Number(params.get('page') ?? '1')
  const perPage = Number(params.get('per_page') ?? '12')

  let items = await getKeberangkatanAktif({
    lokasi: kota ?? undefined,
    durasiHari: durasi ? Number(durasi) : undefined,
  })

  if (bulan) {
    items = items.filter((k) => new Date(k.tanggal_berangkat).getMonth() + 1 === Number(bulan))
  }
  if (tipe) {
    items = items.filter((k) => k.paket?.tier === tipe)
  }

  const total = items.length
  const start = (page - 1) * perPage
  const paged = items.slice(start, start + perPage)

  const mapped = paged.map((k) => ({
    id: k.id,
    nama_paket: k.paket?.nama_paket ?? '',
    tanggal_berangkat: k.tanggal_berangkat,
    durasi_hari: k.durasi_hari,
    tipe_paket: k.paket?.tier ?? k.paket?.kategori ?? '',
    kota_asal: k.lokasi_keberangkatan ?? '',
    maskapai: k.maskapai?.nama ?? '',
    hotel_mekkah: k.hotel_mekkah?.nama ?? '',
    hotel_madinah: k.hotel_madinah?.nama ?? '',
    sisa_kuota: k.status === 'penuh' ? 0 : (k.status === 'terbatas' ? k.kuota_tersisa : null),
    harga_normal: k.harga_normal,
    harga_promo: k.harga_promo,
    url_detail: `${SITE_URL}/paket/${k.paket?.slug ?? ''}?jadwal=${k.id}`,
  }))

  return NextResponse.json({
    items: mapped,
    total,
    page,
    per_page: perPage,
  })
}
