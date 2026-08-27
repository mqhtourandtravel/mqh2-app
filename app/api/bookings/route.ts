import { NextRequest, NextResponse } from 'next/server'
import { verifyRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// GET /api/bookings — list booking user sendiri (jamaah/agen) atau semua (admin).
// POST /api/bookings — buat booking baru.

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const

export async function GET(request: NextRequest) {
  const auth = await verifyRole(request, ['staff_admin', 'agen', 'jamaah'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const sp = request.nextUrl.searchParams
  const status = sp.get('status')

  const where: Record<string, unknown> = {}

  // Jamaah hanya lihat booking sendiri
  if (auth.user.role === 'jamaah') {
    where.userId = auth.user.id
  }

  // Agen lihat booking jamaah binaan
  if (auth.user.role === 'agen') {
    where.user = { agenId: auth.user.id }
  }

  if (status && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    where.status = status
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: { select: { id: true, nama: true, email: true, noWhatsApp: true } },
      keberangkatan: {
        include: {
          paket: { select: { namaPaket: true, slug: true, kategori: true } },
          maskapai: { select: { nama: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(keysToSnake(bookings))
}

export async function POST(request: NextRequest) {
  const auth = await verifyRole(request, ['jamaah', 'agen', 'staff_admin'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()
  const { keberangkatan_id, catatan } = body

  if (!keberangkatan_id) {
    return NextResponse.json({ error: 'keberangkatan_id wajib diisi.' }, { status: 400 })
  }

  // Cek keberangkatan ada & tersedia
  const keberangkatan = await prisma.keberangkatan.findUnique({
    where: { id: keberangkatan_id },
    include: { bookings: { where: { status: { not: 'cancelled' } } } },
  })

  if (!keberangkatan) {
    return NextResponse.json({ error: 'Jadwal keberangkatan tidak ditemukan.' }, { status: 404 })
  }
  if (keberangkatan.status === 'ditutup') {
    return NextResponse.json({ error: 'Jadwal ini sudah ditutup.' }, { status: 400 })
  }
  if (keberangkatan.kuotaTersisa <= 0) {
    return NextResponse.json({ error: 'Kuota sudah penuh.' }, { status: 400 })
  }

  // Cek user belum booking jadwal ini
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId: auth.user.id,
      keberangkatanId: keberangkatan_id,
      status: { not: 'cancelled' },
    },
  })
  if (existingBooking) {
    return NextResponse.json(
      { error: 'Anda sudah memiliki booking untuk jadwal ini.' },
      { status: 409 },
    )
  }

  // Buat booking + kurangi kuota
  const booking = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.create({
      data: {
        userId: auth.user.id,
        keberangkatanId: keberangkatan_id,
        catatan: catatan ?? null,
      },
    })

    await tx.keberangkatan.update({
      where: { id: keberangkatan_id },
      data: { kuotaTersisa: { decrement: 1 } },
    })

    return b
  })

  return NextResponse.json(keysToSnake(booking), { status: 201 })
}
