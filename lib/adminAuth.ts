import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Prisma TIDAK lewat Row Level Security Supabase, jadi proteksi akses endpoint
// admin dipindah ke level kode di sini: setiap request ke /api/admin/* harus
// menyertakan header "Authorization: Bearer <access_token>" dari sesi Supabase
// Auth milik admin yang sedang login (lihat lib/adminApi.ts di sisi client).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client Supabase khusus untuk memvalidasi token (tidak dipakai untuk query data).
const authClient = createClient(supabaseUrl, supabaseAnonKey)

// Allowlist email admin via env ADMIN_EMAILS (pisah koma).
// Tanpa ini, SEMUA user Supabase Auth bisa akses CRUD /api/admin/*.
const allowedEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export async function verifyAdmin(request: NextRequest): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return { ok: false, status: 401, error: 'Tidak ada sesi admin. Silakan login kembali.' }
  }

  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data?.user) {
    return { ok: false, status: 401, error: 'Sesi admin tidak valid atau sudah kedaluwarsa.' }
  }

  if (allowedEmails.length > 0 && (!data.user.email || !allowedEmails.includes(data.user.email.toLowerCase()))) {
    return { ok: false, status: 403, error: 'Akun tidak memiliki akses admin.' }
  }

  return { ok: true }
}
