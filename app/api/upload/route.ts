import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { verifyAdmin } from '@/lib/adminAuth'

// POST /api/upload — admin upload gambar (paket/artikel) ke Vercel Blob.
// Menerima multipart/form-data dengan field "file".
// Return: { url } (public URL blob) atau { error } + status HTTP.

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Body harus multipart/form-data dengan field "file".' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Field "file" tidak ditemukan atau bukan file.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Tipe file tidak diizinkan: ${file.type}. Gunakan JPG, PNG, atau WEBP.` }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: `Ukuran file ${(file.size / 1024 / 1024).toFixed(1)}MB melebihi batas 5MB.` }, { status: 400 })
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'File kosong.' }, { status: 400 })
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp'
  const stem = file.name.replace(/\.[^.]+$/, '').slice(0, 60).replace(/[^a-zA-Z0-9_-]+/g, '-') || 'gambar'

  try {
    const blob = await put(`admin/gambar/${Date.now()}-${stem}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    return NextResponse.json({ url: blob.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengupload ke storage.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
