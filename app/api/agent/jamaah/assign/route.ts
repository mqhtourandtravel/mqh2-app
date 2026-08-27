import { NextRequest, NextResponse } from 'next/server'
import { verifyRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// POST /api/agent/jamaah/assign — assign jamaah ke agen.
// Hanya staff_admin yang bisa assign.
// Body: { user_id: string, agen_id: string | null }
// agen_id = null untuk unassign.
export async function POST(request: NextRequest) {
  const auth = await verifyRole(request, ['staff_admin'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()
  const { user_id, agen_id } = body

  if (!user_id) {
    return NextResponse.json({ error: 'user_id wajib diisi.' }, { status: 400 })
  }

  // Validasi user target ada
  const targetUser = await prisma.user.findUnique({ where: { id: user_id } })
  if (!targetUser) {
    return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })
  }

  // Validasi agen (kalau ada)
  if (agen_id) {
    const agenUser = await prisma.user.findUnique({ where: { id: agen_id } })
    if (!agenUser || agenUser.role !== 'agen') {
      return NextResponse.json({ error: 'Agen tidak valid.' }, { status: 400 })
    }
  }

  // Update
  const updated = await prisma.user.update({
    where: { id: user_id },
    data: { agenId: agen_id || null },
    select: {
      id: true,
      email: true,
      nama: true,
      role: true,
      agenId: true,
    },
  })

  return NextResponse.json(keysToSnake(updated))
}
