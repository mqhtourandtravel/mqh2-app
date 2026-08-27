import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// GET /api/me — ambil profil user yang sedang login.
// PATCH /api/me — update profil user sendiri (nama, no_whatsapp, alamat).
// Berbeda dari /api/admin/*: ini TIDAK butuh role staff_admin,
// cukup login. Jamaah/agen bisa pakai.

export async function GET(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      email: true,
      nama: true,
      role: true,
      noWhatsApp: true,
      alamat: true,
      photoUrl: true,
      agenId: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })
  }

  return NextResponse.json(keysToSnake(user))
}

export async function PATCH(request: NextRequest) {
  const auth = await getUser(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()

  // Hanya field yang boleh diubah user sendiri (whitelist)
  const data: Record<string, unknown> = {}
  if (typeof body.nama === 'string') data.nama = body.nama.trim() || null
  if (typeof body.no_whatsapp === 'string') data.noWhatsApp = body.no_whatsapp.trim() || null
  if (typeof body.alamat === 'string') data.alamat = body.alamat.trim() || null

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Tidak ada data yang diubah.' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data,
    select: {
      id: true,
      email: true,
      nama: true,
      role: true,
      noWhatsApp: true,
      alamat: true,
      photoUrl: true,
      agenId: true,
    },
  })

  return NextResponse.json(keysToSnake(updated))
}
