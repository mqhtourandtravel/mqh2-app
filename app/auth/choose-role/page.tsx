'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { User, Users, Loader2 } from 'lucide-react'

export default function ChooseRolePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setUserEmail(data.session.user.email)
      }
    })
  }, [])

  async function selectRole(role: 'agen' | 'jamaah') {
    setLoading(true)
    setError('')

    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setError('Sesi tidak valid. Silakan login ulang.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/role', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || 'Gagal menyimpan role.')
      setLoading(false)
      return
    }

  // Redirect ke dashboard sesuai role yang dipilih — JANGAN pakai `next`
  // karena next bisa '/admin/*' yang diproteksi layout staff_admin dan
  // memicu loop choose-role kalau role di DB belum kebaca.
  const dashboard = role === 'agen' ? '/agent' : '/jamaah'
  router.push(dashboard)
  router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-primary">Selamat Datang</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {userEmail ? `Login sebagai ${userEmail}` : 'Silakan pilih peran Anda'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pilih peran untuk melanjutkan ke dashboard
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => selectRole('jamaah')}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-secondary-hover hover:bg-secondary/5 transition-all disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-secondary-hover" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-primary">Jamaah</p>
              <p className="text-xs text-muted-foreground">Booking paket umroh & haji</p>
            </div>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          </button>

          <button
            onClick={() => selectRole('agen')}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-secondary-hover hover:bg-secondary/5 transition-all disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-secondary-hover" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-primary">Agen Resmi</p>
              <p className="text-xs text-muted-foreground">Kelola jamaah binaan</p>
            </div>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-6">
          Pilihan ini dapat diubah oleh admin kapan saja.
        </p>
      </div>
    </div>
  )
}