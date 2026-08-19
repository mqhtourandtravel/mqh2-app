import { PrismaClient } from '@prisma/client'

// Pola singleton standar Next.js -- mencegah terlalu banyak koneksi
// database ke Supabase saat hot-reload di development.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
