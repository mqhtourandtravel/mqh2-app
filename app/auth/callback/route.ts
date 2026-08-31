import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Server-side callback setelah Supabase OAuth redirect.
// Flow: Google → Supabase → /auth/callback?code=xxx → exchange → upsert user → redirect

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=no_code`)
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(
    `${origin}${next.startsWith('/') ? next : '/admin/paket'}`
  )

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[auth/callback] exchange error:', error?.message)
    return NextResponse.redirect(`${origin}/admin/login?error=exchange_failed`)
  }

  const supabaseUser = data.user
  const email = supabaseUser.email?.toLowerCase()
  if (!email) {
    return NextResponse.redirect(`${origin}/admin/login?error=no_email`)
  }

  // Upsert user di database — atomic, no race condition.
  // User baru: role 'pending' → nanti diarahkan ke halaman pilih role
  // (agen/jamaah). staff_admin tidak pernah di-set di sini.
  let dbRole: string | null = null
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
    dbRole = dbUser.role
  } catch (err) {
    console.error('[auth/callback] DB upsert error:', err)
    // Fallback: jika DB error, anggap user baru (pending) agar diarahkan
    // ke halaman pilih role, bukan ke /admin yang bisa memicu redirect loop.
    dbRole = 'pending'
  }

  // User baru (role pending) → arahkan ke halaman pilih role, bukan /admin.
  // User yang sudah punya role → lanjut ke `next` seperti biasa.
  if (dbRole === 'pending') {
    return NextResponse.redirect(
      `${origin}/auth/choose-role?${next.startsWith('/') && next !== '/' ? `next=${encodeURIComponent(next)}` : ''}`
    )
  }

  return response
}
