import { NextRequest, NextResponse } from 'next/server'
import { getResource } from '@/lib/adminResources'
import { verifyAdmin } from '@/lib/adminAuth'
import { keysToCamel, keysToSnake } from '@/lib/case'

type Ctx = { params: Promise<{ resource: string; id: string }> }

export async function GET(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })

  const row = await (config.model as any).findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Tidak ditemukan.' }, { status: 404 })
  return NextResponse.json(keysToSnake(row))
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })

  const body = await request.json()
  const data = keysToCamel(body) as Record<string, unknown>
  delete data.id

  try {
    const row = await (config.model as any).update({ where: { id }, data })
    return NextResponse.json(keysToSnake(row))
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'duplicate: data dengan nilai unik ini sudah ada (slug bentrok).' }, { status: 409 })
    }
    return NextResponse.json({ error: err?.message ?? 'Gagal menyimpan data.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })

  try {
    await (config.model as any).delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Gagal menghapus data.' }, { status: 500 })
  }
}
