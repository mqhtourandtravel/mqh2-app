import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/counts?resource=paket|keberangkatan&id=<uuid>
// Count efek cascade delete utk konfirmasi admin: berapa jadwal + booking jamaah
// yang akan IKUT TERHAPUS. Whitelist eksplisit — resource lain ditolak 400.
// Sengaja di luar /api/admin/[resource]/... supaya tidak tersangkut guard isReadOnly.

const ALLOWED = ['paket', 'keberangkatan'] as const

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const sp = request.nextUrl.searchParams
  const resource = sp.get('resource')
  const id = sp.get('id')

  if (!resource || !ALLOWED.includes(resource as (typeof ALLOWED)[number])) {
    return NextResponse.json({ error: 'Resource tidak didukung oleh endpoint counts.' }, { status: 400 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Parameter id wajib diisi.' }, { status: 400 })
  }

  if (resource === 'paket') {
    const anak = await prisma.keberangkatan.findMany({
      where: { paketId: id },
      select: { id: true },
    })
    const booking = anak.length
      ? await prisma.booking.count({ where: { keberangkatanId: { in: anak.map((k) => k.id) } } })
      : 0
    return NextResponse.json({ jadwal: anak.length, booking })
  }

  // keberangkatan: dirinya 1 jadwal, booking langsung padanya
  const booking = await prisma.booking.count({ where: { keberangkatanId: id } })
  return NextResponse.json({ jadwal: 1, booking })
}
