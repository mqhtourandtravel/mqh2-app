'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { adminList } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, Calendar, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [counts, setCounts] = useState({ users: 0, paket: 0, artikel: 0, keberangkatan: 0 })
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }

      const [users, paket, artikel, keberangkatan] = await Promise.all([
        adminList<User>('user'),
        adminList('paket'),
        adminList('artikel'),
        adminList('keberangkatan'),
      ])

      setCounts({
        users: users.length,
        paket: paket.length,
        artikel: artikel.length,
        keberangkatan: keberangkatan.length,
      })
      setRecentUsers(users.slice(-5).reverse())
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  const stats = [
    { label: 'Users', value: counts.users, icon: Users, href: '/admin/users' },
    { label: 'Paket', value: counts.paket, icon: Package, href: '/admin/paket' },
    { label: 'Keberangkatan', value: counts.keberangkatan, icon: Calendar, href: '/admin/paket' },
    { label: 'Artikel', value: counts.artikel, icon: FileText, href: '/admin/artikel' },
  ]

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <h1 className="text-2xl font-serif font-bold text-primary mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <s.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{s.value}</p>
                      <p className="text-[12px] text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada user terdaftar.</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between text-[13.5px] border-b border-accent pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-primary">{u.nama ?? u.email}</p>
                      <p className="text-muted-foreground text-[12px]">{u.email}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      u.role === 'staff_admin' ? 'bg-secondary/10 text-secondary' :
                      u.role === 'agen' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {u.role === 'staff_admin' ? 'Admin' : u.role === 'agen' ? 'Agen' : 'Jamaah'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
