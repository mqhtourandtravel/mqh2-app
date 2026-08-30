import { NextRequest, NextResponse } from 'next/server'
import { getResource, isReadOnly } from '@/lib/adminResources'
import { verifyAdmin } from '@/lib/adminAuth'
import { keysToCamel, keysToSnake } from '@/lib/case'

type Ctx = { params: Promise<{ resource: string; id: string }> }
type AdminModel = {
  findUnique(args: { where: { id: string } }): Promise<unknown | null>
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>
  delete(args: { where: { id: string } }): Promise<unknown>
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Gagal menyimpan data.'
}

export async function GET(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })

  const row = await (config.model as unknown as AdminModel).findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Tidak ditemukan.' }, { status: 404 })
  return NextResponse.json(keysToSnake(row))
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })
  if (isReadOnly(config)) return NextResponse.json({ error: 'Resource ini read-only.' }, { status: 405 })

  const body = await request.json()
  const data = keysToCamel(body) as Record<string, unknown>
  delete data.id

  try {
    const row = await (config.model as unknown as AdminModel).update({ where: { id }, data })
    return NextResponse.json(keysToSnake(row))
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: 'duplicate: data dengan nilai unik ini sudah ada (slug bentrok).' }, { status: 409 })
    }
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) return NextResponse.json({ error: 'Resource tidak dikenal.' }, { status: 404 })
  if (isReadOnly(config)) return NextResponse.json({ error: 'Resource ini read-only.' }, { status: 405 })

  try {
    await (config.model as unknown as AdminModel).delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}
