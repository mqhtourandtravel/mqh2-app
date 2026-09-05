'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import { SignIn2 } from '@/components/ui/clean-minimal-sign-in'

export default function LoginAdmin() {
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/admin/paket'
  const urlError = searchParams.get('error')

  async function handlePasswordLogin(email: string, password: string) {
    setAuthError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setAuthError('Email atau password salah.')
      return
    }
    const target = next.startsWith('/') && !next.startsWith('//') ? next : '/admin/paket'
    window.location.href = target
  }

  async function handleOAuthLogin(provider: 'google' | 'facebook' | 'apple') {
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setAuthError(`Gagal login dengan ${provider}.`)
    }
  }

  const combinedError =
    authError ||
    (urlError === 'role'
      ? 'Akses ditolak. Akun Anda tidak memiliki izin admin.'
      : urlError || '')

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#001f1c] via-[#002A27] to-[#00443F] flex items-center justify-center font-sans">
      <SignIn2
        onSignIn={handlePasswordLogin}
        onOAuth={handleOAuthLogin}
        loading={loading}
        errorMessage={combinedError}
      />
    </main>
  )
}
