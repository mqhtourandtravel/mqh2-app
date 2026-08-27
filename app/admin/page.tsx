'use client'

import { useEffect, useState } from 'react'
import { supabase, User, Paket, Keberangkatan, Artikel } from '@/lib/supabase'
import { adminList } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Package,
  Calendar,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Plane,
  Clock,
  Sparkles,
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [counts, setCounts] = useState({ users: 0, paket: 0, artikel: 0, keberangkatan: 0 })
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentPaket, setRecentPaket] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('Admin')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }

      setAdminName(session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'Admin')

      const [users, paket, artikel, keberangkatan] = await Promise.all([
        adminList<User>('user'),
        adminList<Paket>('paket'),
        adminList<Artikel>('artikel'),
        adminList<Keberangkatan>('keberangkatan'),
      ])

      setCounts({
        users: users.length,
        paket: paket.length,
        artikel: artikel.length,
        keberangkatan: keberangkatan.length,
      })
      setRecentUsers(users.slice(-5).reverse())
      setRecentPaket(paket.slice(0, 4))
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-amber-500 animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    {
      label: 'Total Pengguna',
      value: counts.users,
      icon: Users,
      trend: 'Terdaftar',
      href: '/admin/users',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      iconBg: 'bg-emerald-500/15 text-emerald-700',
    },
    {
      label: 'Paket Umroh & Haji',
      value: counts.paket,
      icon: Package,
      trend: 'Katalog Aktif',
      href: '/admin/paket',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      iconBg: 'bg-amber-500/15 text-amber-700',
    },
    {
      label: 'Jadwal Keberangkatan',
      value: counts.keberangkatan,
      icon: Calendar,
      trend: 'Tersedia',
      href: '/admin/paket',
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      iconBg: 'bg-blue-500/15 text-blue-700',
    },
    {
      label: 'Artikel & Panduan',
      value: counts.artikel,
      icon: FileText,
      trend: 'Diterbitkan',
      href: '/admin/artikel',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      iconBg: 'bg-purple-500/15 text-purple-700',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c2417] via-[#123623] to-[#1a4a31] p-6 md:p-8 text-white shadow-xl border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 size-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md mb-1 border border-white/10">
              <Sparkles className="size-3 text-amber-400" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              Ahlan wa Sahlan, <span className="text-amber-300">{adminName}</span>
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/70 flex items-center gap-2">
              <Clock className="size-3.5 text-amber-400/80" /> {currentDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-[#0c2417] font-semibold shadow-md gap-1.5 h-9 rounded-lg">
              <Link href="/admin/paket/baru">
                <Plus className="size-4" /> Tambah Paket
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10 gap-1.5 h-9 rounded-lg">
              <Link href="/admin/artikel/baru">
                <FileText className="size-4" /> Tulis Artikel
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href} className="group">
              <Card className={`h-full bg-white hover:bg-gradient-to-br ${s.gradient} border border-gray-200/80 hover:border-emerald-300/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden`}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold font-serif text-gray-900">
                      {s.value}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <TrendingUp className="size-3" /> {s.trend}
                    </span>
                  </div>
                  <div className={`size-12 rounded-xl ${s.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    <Icon className="size-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Two-Column Section: Recent Users & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Users (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 px-6 pt-5">
              <div>
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users className="size-4 text-emerald-700" /> Pengguna Baru Terdaftar
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  5 pengguna terakhir yang terhubung ke platform
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-1">
                <Link href="/admin/users">
                  Lihat Semua <ArrowRight className="size-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-gray-100">
              {recentUsers.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Belum ada pengguna terdaftar.</p>
              ) : (
                recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-emerald-50/30 transition-colors text-xs">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-200">
                        {(u.nama ?? u.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.nama ?? 'Nama Belum Diisi'}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      u.role === 'staff_admin'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : u.role === 'agen'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {u.role === 'staff_admin' ? 'Staff Admin' : u.role === 'agen' ? 'Agen Resmi' : 'Jamaah'}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Package Preview */}
          <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 px-6 pt-5">
              <div>
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Package className="size-4 text-amber-600" /> Katalog Paket Utama
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Daftar paket yang sedang aktif ditampilkan ke publik
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50 gap-1">
                <Link href="/admin/paket">
                  Kelola Paket <ArrowRight className="size-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentPaket.map((p) => (
                <Link key={p.id} href={`/admin/paket/${p.id}`} className="group p-3 rounded-lg border border-gray-100 hover:border-amber-300 bg-gray-50/50 hover:bg-amber-50/20 transition-all flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                      {p.nama_paket}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize">{p.kategori} {p.tier ? `• ${p.tier}` : ''}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {p.status}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Shortcuts & System Status */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <Card className="border border-gray-200/80 shadow-sm rounded-xl bg-white p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Pintasan Cepat</h3>
            <div className="space-y-2">
              <Link
                href="/admin/paket/baru"
                className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-900 border border-emerald-100 transition-all text-xs font-semibold"
              >
                <Plus className="size-4 text-emerald-700" />
                <span>Tambah Paket Umroh Baru</span>
              </Link>
              <Link
                href="/admin/master"
                className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/60 hover:bg-amber-100/60 text-amber-900 border border-amber-100 transition-all text-xs font-semibold"
              >
                <Plane className="size-4 text-amber-700" />
                <span>Kelola Maskapai & Hotel</span>
              </Link>
              <Link
                href="/admin/agents"
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/60 hover:bg-blue-100/60 text-blue-900 border border-blue-100 transition-all text-xs font-semibold"
              >
                <Users className="size-4 text-blue-700" />
                <span>Atur Jamaah & Agen Binaan</span>
              </Link>
            </div>
          </Card>

          {/* System Health Card */}
          <Card className="border border-emerald-900/20 shadow-sm rounded-xl bg-gradient-to-br from-[#0c2417] to-[#163e28] text-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" /> Status Layanan
              </span>
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="space-y-2.5 text-xs text-emerald-100/80">
              <div className="flex justify-between">
                <span>Database PostgreSQL</span>
                <span className="font-semibold text-emerald-300">Terhubung</span>
              </div>
              <div className="flex justify-between">
                <span>Supabase Auth SSR</span>
                <span className="font-semibold text-emerald-300">Aktif</span>
              </div>
              <div className="flex justify-between">
                <span>Auto Sync Role</span>
                <span className="font-semibold text-emerald-300">Normal</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
