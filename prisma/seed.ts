import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dummyMaskapai = [
  { nama: 'Saudi Airlines', logoUrl: '/images/airplane-travel.jpg' },
  { nama: 'Garuda Indonesia', logoUrl: null },
  { nama: 'Etihad Airways', logoUrl: null },
]

const dummyHotel = [
  { nama: 'Swissôtel Makkah', kota: 'Makkah' },
  { nama: 'Pullman Zamzam Makkah', kota: 'Makkah' },
  { nama: 'Al Madinah Mövenpick', kota: 'Madinah' },
  { nama: 'Hilton Suites Makkah', kota: 'Makkah' },
]

const dummyPaket = [
  { slug: 'umroh-reguler', namaPaket: 'Umroh Reguler', kategori: 'umroh', tier: null, deskripsi: 'Paket umroh standar dengan layanan lengkap. Hotel bintang 4, maskapai ternama, dan pembimbing ibadah berpengalaman.', gambarUrl: '/images/mosque-night.jpg', status: 'aktif', urutan: 1 },
  { slug: 'umroh-premium', namaPaket: 'Umroh Premium', kategori: 'umroh', tier: 'Privat', deskripsi: 'Paket umroh premium dengan hotel bintang 5 dekat Masjidil Haram, layanan VIP, dan pembimbing personal.', gambarUrl: '/images/kaaba-closeup.jpg', status: 'aktif', urutan: 2 },
  { slug: 'haji-plus', namaPaket: 'Haji Plus', kategori: 'haji', tier: null, deskripsi: 'Program haji dengan layanan premium dan kuota pasti berangkat. Fasilitas hotel dekat Haram & Nabawi.', gambarUrl: '/images/madinah-mosque.jpg', status: 'aktif', urutan: 3 },
  { slug: 'halal-tour', namaPaket: 'Halal Tour Turki', kategori: 'tour', tier: null, deskripsi: 'Wisata halal ke Turki: Istanbul, Cappadocia, Bursa. Hotel bintang 4, transport AC, guide berlisensi.', gambarUrl: '/images/taj-mahal.jpg', status: 'aktif', urutan: 4 },
  { slug: 'badal-umroh', namaPaket: 'Badal Umroh', kategori: 'badal', tier: null, deskripsi: 'Layanan umroh badal untuk orang tua, sakit, atau yang sudah meninggal. Dipimpin mutawwif khusus.', gambarUrl: '/images/prayer-hands.jpg', status: 'aktif', urutan: 5 },
]

const dummyArtikel = [
  { slug: 'panduan-menasik-haji', judul: 'Panduan Manasik Haji Lengkap untuk Pemula', ringkasan: 'Simak panduan manasik haji dari ihram hingga wukuf.', kategori: 'Panduan', gambarUrl: '/images/hotel-luxury.jpg', status: 'terbit', diterbitkanPada: new Date('2026-08-01'), konten: 'Manasik haji adalah simulasi ritual haji yang wajib diikuti oleh setiap jamaah sebelum keberangkatan...' },
  { slug: 'tips-umroh-pertama', judul: '10 Tips Umroh Pertama Kali agar Lancar', ringkasan: 'Persiapan penting sebelum berangkat umroh untuk pertama kalinya.', kategori: 'Tips', gambarUrl: '/images/travel-planning.jpg', status: 'terbit', diterbitkanPada: new Date('2026-08-10'), konten: 'Umroh pertama kali membutuhkan persiapan matang dari segi fisik, mental, dan administrasi...' },
  { slug: 'hotel-nabawi-review', judul: 'Review Hotel Dekat Masjid Nabawi, Madinah', ringkasan: 'Perbandingan 3 hotel terbaik yang dekat dengan Masjid Nabawi.', kategori: 'Review', gambarUrl: '/images/madinah-mosque.jpg', status: 'terbit', diterbitkanPada: new Date('2026-08-18'), konten: 'Mencari hotel dekat Masjid Nabawi memang gampang-gampang susah...' },
]

const dummyKeberangkatan = [
  { paketSlug: 'umroh-reguler', tanggal: '2026-10-15', durasiHari: 12, lokasi: 'Jakarta', maskapaiIdx: 0, hotelMekkahIdx: 0, hotelMadinahIdx: 2, hargaNormal: 32500000, hargaPromo: 29900000, kuota: 45, tersisa: 20, status: 'tersedia' },
  { paketSlug: 'umroh-reguler', tanggal: '2026-11-20', durasiHari: 12, lokasi: 'Semarang', maskapaiIdx: 1, hotelMekkahIdx: 1, hotelMadinahIdx: 2, hargaNormal: 33500000, hargaPromo: null, kuota: 40, tersisa: 35, status: 'tersedia' },
  { paketSlug: 'umroh-premium', tanggal: '2026-10-20', durasiHari: 14, lokasi: 'Jakarta', maskapaiIdx: 2, hotelMekkahIdx: 3, hotelMadinahIdx: 2, hargaNormal: 52000000, hargaPromo: 48500000, kuota: 20, tersisa: 8, status: 'tersedia' },
  { paketSlug: 'haji-plus', tanggal: '2027-06-01', durasiHari: 21, lokasi: 'Jakarta', maskapaiIdx: 0, hotelMekkahIdx: 0, hotelMadinahIdx: 2, hargaNormal: 285000000, hargaPromo: null, kuota: 30, tersisa: 12, status: 'tersedia' },
  { paketSlug: 'halal-tour', tanggal: '2026-12-05', durasiHari: 8, lokasi: 'Jakarta', maskapaiIdx: 1, hotelMekkahIdx: null, hotelMadinahIdx: null, hargaNormal: 18500000, hargaPromo: 16900000, kuota: 25, tersisa: 15, status: 'tersedia' },
]

async function main() {
  // MASKAPAI
  for (const m of dummyMaskapai) {
    const exists = await prisma.maskapai.findFirst({ where: { nama: m.nama } })
    if (!exists) {
      await prisma.maskapai.create({ data: m })
      console.log('+ maskapai:', m.nama)
    }
  }

  // HOTEL
  for (const h of dummyHotel) {
    const exists = await prisma.hotel.findFirst({ where: { nama: h.nama } })
    if (!exists) {
      await prisma.hotel.create({ data: h })
      console.log('+ hotel:', h.nama)
    }
  }

  // PAKET
  for (const p of dummyPaket) {
    const exists = await prisma.paket.findFirst({ where: { slug: p.slug } })
    if (!exists) {
      await prisma.paket.create({ data: p })
      console.log('+ paket:', p.namaPaket)
    }
  }

  // ARTIKEL
  for (const a of dummyArtikel) {
    const exists = await prisma.artikel.findFirst({ where: { slug: a.slug } })
    if (!exists) {
      await prisma.artikel.create({ data: a })
      console.log('+ artikel:', a.judul)
    }
  }

  // KEBERANGKATAN (perlu resolve paket & maskapai & hotel ID)
  const maskapaiList = await prisma.maskapai.findMany()
  const hotelList = await prisma.hotel.findMany()
  const mLookup: Record<number, string> = {}
  maskapaiList.forEach((m, i) => mLookup[i] = m.id)
  const hLookup: Record<number, string> = {}
  hotelList.forEach((h, i) => hLookup[i] = h.id)

  for (const k of dummyKeberangkatan) {
    const paket = await prisma.paket.findFirst({ where: { slug: k.paketSlug } })
    if (!paket) { console.log('! skip keberangkatan: paket', k.paketSlug, 'tidak ada'); continue }

    const exists = await prisma.keberangkatan.findFirst({
      where: { paketId: paket.id, tanggalBerangkat: new Date(k.tanggal) }
    })
    if (exists) continue

    await prisma.keberangkatan.create({
      data: {
        paketId: paket.id,
        tanggalBerangkat: new Date(k.tanggal),
        durasiHari: k.durasiHari,
        lokasiKeberangkatan: k.lokasi,
        maskapaiId: k.maskapaiIdx !== null ? mLookup[k.maskapaiIdx] : null,
        hotelMekkahId: k.hotelMekkahIdx !== null ? hLookup[k.hotelMekkahIdx] : null,
        hotelMadinahId: k.hotelMadinahIdx !== null ? hLookup[k.hotelMadinahIdx] : null,
        hargaNormal: k.hargaNormal,
        hargaPromo: k.hargaPromo,
        kuotaTotal: k.kuota,
        kuotaTersisa: k.tersisa,
        status: k.status,
      }
    })
    console.log('+ keberangkatan:', k.paketSlug, k.tanggal)
  }

  console.log('\nSeed selesai!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
