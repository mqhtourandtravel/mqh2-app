import { NextRequest, NextResponse } from 'next/server'
import { getResource } from '@/lib/adminResources'
import { verifyAdmin } from '@/lib/adminAuth'
import { keysToCamel, keysToSnake, snakeToCamel } from '@/lib/case'

type AdminModel = {
  findMany(args: { where: Record<string, unknown>; orderBy: Record<string, string> }): Promise<unknown[]>
  create(args: { data: unknown }): Promise<unknown>
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Gagal menyimpan data.'
}

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

  const rows = await (config.model as unknown as AdminModel).findMany({
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
    const row = await (config.model as unknown as AdminModel).create({ data })
    return NextResponse.json(keysToSnake(row))
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: 'duplicate: data dengan nilai unik ini sudah ada (slug bentrok).' }, { status: 409 })
    }
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}
