import { NextRequest, NextResponse } from 'next/server'
import { getResource } from '@/lib/adminResources'
import { verifyAdmin } from '@/lib/adminAuth'
import { keysToCamel, keysToSnake, snakeToCamel } from '@/lib/case'

// Endpoint generik untuk semua resource admin (paket, keberangkatan, cabang,
// testimoni, artikel, tentang, maskapai, hotel). Menggantikan pemanggilan
// langsung `supabase.from(table)` dari komponen client -- karena Prisma cuma
// bisa jalan di server, semua query CRUD admin sekarang lewat sini.

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })

  const sp = request.nextUrl.searchParams
  const orderByField = sp.get('orderBy') ? snakeToCamel(sp.get('orderBy')!) : config.defaultOrderBy
  const dir = sp.get('dir') === 'desc' ? 'desc' : 'asc'

  const where: Record<string, unknown> = {}
  sp.forEach((value, key) => {
    if (key === 'orderBy' || key === 'dir') return
    where[snakeToCamel(key)] = value
  })

  const rows = await (config.model as any).findMany({
    where,
    orderBy: { [orderByField]: dir },
  })

  return NextResponse.json(keysToSnake(rows))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })

  const body = await request.json()
  const data = keysToCamel(body)

  try {
    const row = await (config.model as any).create({ data })
    return NextResponse.json(keysToSnake(row))
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'duplicate: data dengan nilai unik ini sudah ada (slug bentrok).' }, { status: 409 })
    }
    return NextResponse.json({ error: err?.message ?? 'Gagal menyimpan data.' }, { status: 500 })
  }
}
