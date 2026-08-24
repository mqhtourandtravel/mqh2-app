'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email atau password salah.')
      return
    }
    router.push('/admin/paket')
  }

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm">
        <p className="font-serif text-2xl text-primary-foreground text-center mb-1">
          MQH<span className="text-secondary">·</span>Tour
        </p>
        <p className="text-[12px] text-sidebar-muted/60 text-center uppercase tracking-wide mb-8">Admin Panel</p>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-white/15 text-primary-foreground placeholder:text-sidebar-muted/50 focus-visible:border-secondary focus-visible:ring-secondary"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-white/15 text-primary-foreground placeholder:text-sidebar-muted/50 focus-visible:border-secondary focus-visible:ring-secondary"
            required
          />
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" variant="secondary" disabled={loading} className="w-full">
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </main>
  )
}
