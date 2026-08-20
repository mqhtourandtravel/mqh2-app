import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dummyTestimoni = [
  {
    isi: "Pelayanan sangat memuaskan, mulai dari pendaftaran hingga kepulangan berjalan tertib dan profesional.",
    namaSumber: "Jamaah Kloter 12",
    urutan: 1,
    status: "aktif",
  },
  {
    isi: "Pembimbing ibadahnya sabar dan berpengalaman, jamaah lansia pun terbantu dengan baik.",
    namaSumber: "Jamaah Kloter 08",
    urutan: 2,
    status: "aktif",
  },
  {
    isi: "Alhamdulillah keberangkatan sesuai jadwal, hotel dekat dengan Masjidil Haram, sangat nyaman.",
    namaSumber: "Jamaah Kloter 15",
    urutan: 3,
    status: "aktif",
  },
  {
    isi: "Tim MQH sangat responsif menjawab pertanyaan, dari sebelum berangkat sampai selesai ibadah.",
    namaSumber: "Jamaah Kloter 21",
    urutan: 4,
    status: "aktif",
  },
]

async function main() {
  for (const t of dummyTestimoni) {
    const existing = await prisma.testimoni.findFirst({
      where: { isi: t.isi },
    })
    if (!existing) {
      await prisma.testimoni.create({ data: t })
      console.log(`Inserted testimoni: ${t.namaSumber}`)
    } else {
      console.log(`Already exists, skipping: ${t.namaSumber}`)
    }
  }
  console.log('Seed testimoni selesai')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })