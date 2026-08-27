import { NextRequest, NextResponse } from 'next/server'
import { verifyRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// GET /api/agent/jamaah — lihat jamaah binaan.
// Agen hanya lihat jamaah sendiri. Staff admin bisa lihat semua.
export async function GET(request: NextRequest) {
  const auth = await verifyRole(request, ['staff_admin', 'agen'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const sp = request.nextUrl.searchParams
  const search = sp.get('search') ?? ''

  const where: Record<string, unknown> = {}

  // Agen hanya lihat jamaah sendiri
  if (auth.user.role === 'agen') {
    where.agenId = auth.user.id
  }

  // Search by nama or email
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      nama: true,
      role: true,
      noWhatsApp: true,
      photoUrl: true,
      agenId: true,
      createdAt: true,
    },
  })

  return NextResponse.json(keysToSnake(users))
}
