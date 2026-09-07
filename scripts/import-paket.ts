import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface PaketScraped {
  name: string
  price: string // e.g. "Rp 30.900.000" or "Mulai Rp 14.950.000"
}

const rawData: PaketScraped[] = [
  { name: 'Umroh Berkah 2', price: 'Rp 30.900.000' },
  { name: 'Umroh Hebat', price: 'Rp 31.400.000' },
  { name: 'Umroh Safar', price: 'Rp 33.400.000' },
  { name: 'Umroh Liburan Sekolah', price: 'Rp 34.900.000' },
  { name: 'Umroh Plus Turki', price: 'Rp 33.900.000' },
  { name: 'Umroh Semi Backpacker', price: 'Mulai Rp 14.950.000' },
  { name: 'Umroh Nyaman', price: 'Mulai Rp 31.400.000' },
  { name: 'Umroh Berkah', price: 'Rp 29.900.000' },
  { name: 'Umroh Liburan Akhir Tahun', price: 'Rp 33.800.000' },
  { name: 'Umroh Privat', price: 'Mulai Rp 34.700.000' },
  { name: 'Badal Umroh Hemat', price: 'Rp 1.900.000' },
]

function parsePrice(priceStr: string): number | null {
  // remove "Mulai " if present
  const cleaned = priceStr.replace(/^Mulai\s*/, '').replace(/Rp\s*/, '').replace(/\./g, '').replace(/,/g, '').trim()
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('Starting import...')
  for (const item of rawData) {
    const slug = slugify(item.name)
    const harga = parsePrice(item.price)
    if (!harga) {
      console.warn(`Skipping ${item.name}: invalid price ${item.price}`)
      continue
    }

    // Check if paket already exists
    const existing = await prisma.paket.findUnique({ where: { slug } })
    if (existing) {
      console.log(`Paket ${item.name} already exists, skipping`)
      continue
    }

    // Create paket
    const paket = await prisma.paket.create({
      data: {
        slug,
        namaPaket: item.name,
        kategori: 'umroh',
        status: 'aktif',
        urutan: 0,
        // gambarUrl: null,
      },
    })
    console.log(`Created paket: ${paket.namaPaket} (${paket.slug})`)

    // Create one Keberangkatan with default values
    // Tanggal berangkat: set to 3 months from now as placeholder
    const berangkat = new Date()
    berangkat.setMonth(berangkat.getMonth() + 3)
    // Set to first day of month
    berangkat.setDate(1)

    await prisma.keberangkatan.create({
      data: {
        paketId: paket.id,
        tanggalBerangkat: berangkat,
        durasiHari: 12, // default
        lokasiKeberangkatan: 'Jakarta', // default
        hargaNormal: harga,
        hargaPromo: null,
        kuotaTotal: 20,
        kuotaTersisa: 20,
        status: 'tersedia',
        // maskapaiId, hotelMekkahId, hotelMadinahId: null
      },
    })
    console.log(`  Added Keberangkatan with harga ${harga}`)
  }
  console.log('Import done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })