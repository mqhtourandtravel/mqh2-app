import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const paket = await prisma.paket.findMany({
    include: { keberangkatan: true },
    orderBy: { urutan: 'asc' },
  })
  console.log(`TOTAL PAKET: ${paket.length}`)
  for (const p of paket) {
    for (const k of p.keberangkatan) {
      console.log(`${p.namaPaket} | ${p.kategori} | ${k.tanggalBerangkat.toISOString().slice(0,10)} | Rp ${k.hargaNormal} | ${k.lokasiKeberangkatan} | ${k.status}`)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())