'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { agentListJamaah } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Phone, Mail } from 'lucide-react'

export default function AgentDashboard() {
  const router = useRouter()
  const [jamaahList, setJamaahList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      setUserName(session.user.user_metadata?.full_name ?? session.user.email ?? '')
      muatJamaah()
    }
    init()
  }, [router])

  async function muatJamaah(q?: string) {
    setLoading(true)
    const data = await agentListJamaah<User>({ search: q })
    setJamaahList(data)
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    muatJamaah(search)
  }

  return (
    <AdminShell>
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary">Dashboard Agen</h1>
          <p className="text-sm text-muted-foreground mt-1">Selamat datang, {userName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{jamaahList.length}</p>
                  <p className="text-[12px] text-muted-foreground">Jamaah Binaan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jamaah List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Jamaah Binaan</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-[200px] h-8 text-[13px]"
              />
            </form>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Memuat...</p>
            ) : jamaahList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {search ? 'Tidak ada jamaah ditemukan.' : 'Belum ada jamaah binaan.'}
              </p>
            ) : (
              <div className="space-y-3">
                {jamaahList.map((j) => (
                  <div key={j.id} className="flex items-center justify-between text-[13.5px] border-b border-accent pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      {j.photo_url ? (
                        <Image src={j.photo_url} alt="" width={36} height={36} unoptimized className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[11px] font-semibold text-primary">
                            {(j.nama ?? j.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-primary">{j.nama ?? <span className="italic text-muted-foreground">-</span>}</p>
                        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="size-3" /> {j.email}</span>
                          {j.no_whatsapp && <span className="flex items-center gap-1"><Phone className="size-3" /> {j.no_whatsapp}</span>}
                        </div>
                      </div>
                    </div>
                    <Badge variant="soft" className="text-[11px]">{j.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
