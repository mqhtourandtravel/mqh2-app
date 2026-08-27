'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { meGet, meUpdate } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function JamaahProfil() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [nama, setNama] = useState('')
  const [noWa, setNoWa] = useState('')
  const [alamat, setAlamat] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }

      const u = await meGet<User>()
      if (u) {
        setUser(u)
        setNama(u.nama ?? '')
        setNoWa(u.no_whatsapp ?? '')
        setAlamat(u.alamat ?? '')
      }
      setLoading(false)
    }
    init()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const { error: err } = await meUpdate({
      nama: nama || '',
      no_whatsapp: noWa || '',
      alamat: alamat || '',
    })

    if (err) {
      setError(err)
    } else {
      setSuccess('Profil berhasil disimpan.')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-2xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Profil Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-4">
              {user?.photo_url ? (
                <Image src={user.photo_url} alt="" width={64} height={64} unoptimized className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {(user?.nama ?? user?.email ?? '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-primary">{user?.nama ?? '-'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-[11px] text-muted-foreground capitalize">Role: {user?.role}</p>
              </div>
            </div>

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/20">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-primary mb-1 block">Nama Lengkap</label>
                <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-primary mb-1 block">No. WhatsApp</label>
                <Input value={noWa} onChange={(e) => setNoWa(e.target.value)} placeholder="628xxx" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-primary mb-1 block">Alamat</label>
                <Input value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Alamat lengkap" />
              </div>
              <Button type="submit" variant="secondary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
