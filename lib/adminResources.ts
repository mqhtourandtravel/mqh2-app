import { prisma } from '@/lib/prisma'

// Setiap resource yang boleh diakses lewat /api/admin/[resource].
// `model` = delegate Prisma, `defaultOrderBy` = field default kalau client
// tidak mengirim query ?orderBy=.
export const adminResources = {
  paket: { model: prisma.paket, defaultOrderBy: 'urutan' },
  keberangkatan: { model: prisma.keberangkatan, defaultOrderBy: 'tanggalBerangkat' },

  artikel: { model: prisma.artikel, defaultOrderBy: 'diterbitkanPada' },
  maskapai: { model: prisma.maskapai, defaultOrderBy: 'nama' },
  hotel: { model: prisma.hotel, defaultOrderBy: 'nama' },
} as const

export type AdminResourceName = keyof typeof adminResources

export function getResource(name: string) {
  return adminResources[name as AdminResourceName]
}
