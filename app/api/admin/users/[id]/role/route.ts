import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// Endpoint khusus ubah role user. Hanya staff_admin yang boleh.
// Terpisah dari generic PATCH /api/admin/user/[id] supaya ada
// guard role yang ketat — admin tidak bisa downgrade diri sendiri.

const VALID_ROLES = ['staff_admin', 'jamaah', 'agen'] as const

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await request.json()
  const newRole = body.role as string

  if (!newRole || !VALID_ROLES.includes(newRole as typeof VALID_ROLES[number])) {
    return NextResponse.json(
      { error: `Role tidak valid. Pilih: ${VALID_ROLES.join(', ')}` },
      { status: 400 },
    )
  }

  // Cegah admin downgrade diri sendiri
  const targetUser = await prisma.user.findUnique({ where: { id } })
  if (!targetUser) {
    return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })
  }
  if (targetUser.id === auth.user.id && newRole !== 'staff_admin') {
    return NextResponse.json(
      { error: 'Tidak bisa mengubah role diri sendiri.' },
      { status: 403 },
    )
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: newRole },
  })

  return NextResponse.json(keysToSnake(updated))
}
