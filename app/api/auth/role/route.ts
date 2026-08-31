import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// PATCH /api/auth/role — user pending memilih role sendiri SAAT PERTAMA login.
// Hanya menerima 'agen' atau 'jamaah'. staff_admin TIDAK PERNAH bisa dibuat
// lewat endpoint ini (hanya 1 admin yang di-setup manual di DB).
export async function PATCH(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid.' }, { status: 400 })
  }

  const role = (body as { role?: unknown })?.role
  if (role !== 'agen' && role !== 'jamaah') {
    return NextResponse.json(
      { error: 'Role tidak valid. Pilih: agen atau jamaah.' },
      { status: 400 },
    )
  }

  // Hanya user 'pending' boleh memilih sendiri. User yang sudah punya role
  // tidak bisa mengubah role-nya di sini — harus lewat admin.
  if (auth.user.role !== 'pending') {
    return NextResponse.json(
      { error: 'Role Anda sudah ditetapkan. Hubungi admin untuk perubahan.' },
      { status: 403 },
    )
  }

  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: { role },
    select: { id: true, email: true, role: true },
  })

  return NextResponse.json(keysToSnake(updated))
}