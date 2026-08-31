import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// Supabase client khusus server-side auth validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const authClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Valid role constants
export const ROLES = {
  STAFF_ADMIN: 'staff_admin',
  JAMAAH: 'jamaah',
  AGEN: 'agen',
  PENDING: 'pending',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Role yang boleh dipilih user sendiri saat pertama kali login.
// staff_admin TIDAK pernah bisa dibuat lewat aplikasi — hanya 1 user
// yang sudah di-setup manual di DB.
export const SELF_SELECTABLE_ROLES = [ROLES.JAMAAH, ROLES.AGEN] as const

export type AuthUser = {
  id: string
  authId: string
  email: string
  nama: string | null
  role: Role
  photoUrl: string | null
  agenId: string | null
}

type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; status: number; error: string }

/**
 * Validate Supabase token, find/create user di DB, return user + role.
 * Dipakai di semua endpoint yang butuh auth.
 */
export async function getUser(request: NextRequest): Promise<AuthResult> {
  // 1. Ambil token dari Authorization header
  const header =
    request.headers.get('authorization') ?? request.headers.get('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return { ok: false, status: 401, error: 'Tidak ada sesi. Silakan login.' }
  }

  // 2. Validate token via Supabase Auth
  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || !authData?.user) {
    return { ok: false, status: 401, error: 'Sesi tidak valid atau kedaluwarsa.' }
  }

  const supabaseUser = authData.user
  const email = supabaseUser.email?.toLowerCase()
  if (!email) {
    return { ok: false, status: 400, error: 'Akun tidak memiliki email.' }
  }

  // 3. Upsert user di database (atomic — no race condition)
  try {
    const meta = supabaseUser.user_metadata ?? {}
    const dbUser = await prisma.user.upsert({
      where: { authId: supabaseUser.id },
      create: {
        authId: supabaseUser.id,
        email,
        nama: meta.full_name ?? meta.name ?? null,
        photoUrl: meta.avatar_url ?? meta.picture ?? null,
        role: 'pending',
      },
      update: {
        ...(meta.full_name ? { nama: meta.full_name } : {}),
        ...(meta.avatar_url ? { photoUrl: meta.avatar_url } : {}),
      },
    })

    return {
      ok: true,
      user: {
        id: dbUser.id,
        authId: dbUser.authId,
        email: dbUser.email,
        nama: dbUser.nama,
        role: dbUser.role as Role,
        photoUrl: dbUser.photoUrl,
        agenId: dbUser.agenId,
      },
    }
  } catch (err) {
    console.error('[auth] DB error:', err)
    return { ok: false, status: 500, error: 'Gagal memproses sesi.' }
  }
}

/**
 * Middleware: verify user punya role yang diizinkan.
 * Usage: const auth = await verifyRole(request, ['staff_admin'])
 */
export async function verifyRole(
  request: NextRequest,
  allowedRoles: Role[],
): Promise<AuthResult> {
  const auth = await getUser(request)
  if (!auth.ok) return auth

  if (!allowedRoles.includes(auth.user.role)) {
    return {
      ok: false,
      status: 403,
      error: `Akses ditolak. Role "${auth.user.role}" tidak memiliki izin.`,
    }
  }

  return auth
}

/**
 * Middleware shorthand: verify admin (staff_admin only).
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  return verifyRole(request, [ROLES.STAFF_ADMIN])
}

/**
 * Baca sesi + role dari cookie — untuk Server Component (layout).
 * Middleware jalan di Edge runtime dan tidak bisa memakai Prisma,
 * jadi gate role dilakukan di sini (Node runtime).
 * Return null kalau tidak login / user belum ter-provision / DB error.
 */
export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      // Layout hanya membaca sesi; refresh cookie ditangani middleware.
      setAll: () => {},
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  try {
    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } })
    if (!dbUser) return null
    return {
      id: dbUser.id,
      authId: dbUser.authId,
      email: dbUser.email,
      nama: dbUser.nama,
      role: dbUser.role as Role,
      photoUrl: dbUser.photoUrl,
      agenId: dbUser.agenId,
    }
  } catch (err) {
    console.error('[auth] getSessionUser DB error:', err)
    return null
  }
}
