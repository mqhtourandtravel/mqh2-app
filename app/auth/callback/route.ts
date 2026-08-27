import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Server-side callback setelah Supabase OAuth redirect.
// Flow: Google → Supabase → /auth/callback?code=xxx → exchange → upsert user → redirect

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=no_code`)
  }

  // Exchange code for session
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
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

  // Upsert user di database
  try {
    const meta = supabaseUser.user_metadata ?? {}

    const existing = await prisma.user.findUnique({
      where: { authId: supabaseUser.id },
    })

    if (!existing) {
      // First login — create dengan role default
      await prisma.user.create({
        data: {
          authId: supabaseUser.id,
          email,
          nama: meta.full_name ?? meta.name ?? null,
          photoUrl: meta.avatar_url ?? meta.picture ?? null,
          role: 'jamaah',
        },
      })
    } else {
      // Returning user — sync metadata
      const updates: Record<string, unknown> = {}
      if (meta.full_name && meta.full_name !== existing.nama) updates.nama = meta.full_name
      if (meta.avatar_url && meta.avatar_url !== existing.photoUrl) updates.photoUrl = meta.avatar_url
      if (Object.keys(updates).length > 0) {
        await prisma.user.update({ where: { id: existing.id }, data: updates })
      }
    }
  } catch (err) {
    console.error('[auth/callback] DB upsert error:', err)
    // Tetap redirect — user sudah login di Supabase, DB error tidak blocking
  }

  // Redirect ke halaman tujuan
  const redirectTo = next.startsWith('/') ? next : '/admin/paket'
  return NextResponse.redirect(`${origin}${redirectTo}`)
}
