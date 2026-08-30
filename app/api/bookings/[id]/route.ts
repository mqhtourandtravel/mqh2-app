import { NextRequest, NextResponse } from 'next/server'
import { verifyRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { keysToSnake } from '@/lib/case'

// GET /api/bookings/[id] — lihat detail booking.
// PATCH /api/bookings/[id] — update status (admin) / cancel (jamaah sendiri).

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Ctx) {
  const auth = await verifyRole(request, ['staff_admin', 'agen', 'jamaah'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, nama: true, email: true, noWhatsApp: true, alamat: true, agenId: true } },
      keberangkatan: {
        include: {
          paket: { select: { namaPaket: true, slug: true, kategori: true, deskripsi: true } },
          maskapai: { select: { nama: true } },
          hotelMekkah: { select: { nama: true } },
          hotelMadinah: { select: { nama: true } },
        },
      },
    },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking tidak ditemukan.' }, { status: 404 })
  }

  // Jamaah hanya bisa lihat booking sendiri
  if (auth.user.role === 'jamaah' && booking.userId !== auth.user.id) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 })
  }

  // Agen hanya bisa lihat booking jamaah binaannya
  if (auth.user.role === 'agen' && booking.user.agenId !== auth.user.id) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 })
  }

  return NextResponse.json(keysToSnake(booking))
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await verifyRole(request, ['staff_admin', 'jamaah'])
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await request.json()

  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) {
    return NextResponse.json({ error: 'Booking tidak ditemukan.' }, { status: 404 })
  }

  // Jamaah hanya bisa cancel booking sendiri
  if (auth.user.role === 'jamaah') {
    if (booking.userId !== auth.user.id) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 })
    }
    if (body.status !== 'cancelled') {
      return NextResponse.json({ error: 'Jamaah hanya bisa membatalkan booking.' }, { status: 403 })
    }
  }

  const newStatus = body.status as string
  const VALID = ['pending', 'confirmed', 'cancelled', 'completed'] as const
  if (!newStatus || !VALID.includes(newStatus as typeof VALID[number])) {
    return NextResponse.json({ error: `Status tidak valid. Pilih: ${VALID.join(', ')}` }, { status: 400 })
  }

  // Cancel → kembalikan kuota
  if (newStatus === 'cancelled' && booking.status !== 'cancelled') {
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({ where: { id }, data: { status: newStatus } })
      await tx.keberangkatan.update({
        where: { id: booking.keberangkatanId },
        data: { kuotaTersisa: { increment: 1 } },
      })
    })
  } else {
    await prisma.booking.update({ where: { id }, data: { status: newStatus } })
  }

  const updated = await prisma.booking.findUnique({ where: { id } })
  return NextResponse.json(keysToSnake(updated))
}
