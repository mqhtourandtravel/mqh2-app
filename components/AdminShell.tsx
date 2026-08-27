'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  UserCheck,
  Database,
  ExternalLink,
  LogOut,
  CalendarCheck,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Shield,
  Sparkles,
} from 'lucide-react'

type MenuItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  group?: string
}

const ADMIN_MENU: MenuItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, group: 'UTAMA' },
  { href: '/admin/paket', label: 'Paket & Jadwal', icon: Package, group: 'MANAJEMEN' },
  { href: '/admin/artikel', label: 'Artikel Edukasi', icon: FileText, group: 'MANAJEMEN' },
  { href: '/admin/users', label: 'Semua Pengguna', icon: Users, group: 'PENGGUNA' },
  { href: '/admin/agents', label: 'Agen & Jamaah', icon: UserCheck, group: 'PENGGUNA' },
  { href: '/admin/master', label: 'Master Maskapai & Hotel', icon: Database, group: 'PENGATURAN' },
]

const AGENT_MENU: MenuItem[] = [
  { href: '/agent', label: 'Dashboard Agen', icon: LayoutDashboard, exact: true, group: 'UTAMA' },
  { href: '/agent/jamaah', label: 'Jamaah Binaan', icon: Users, group: 'MANAJEMEN' },
]

const JAMAAH_MENU: MenuItem[] = [
  { href: '/jamaah', label: 'Booking Saya', icon: CalendarCheck, exact: true, group: 'UTAMA' },
  { href: '/jamaah/paket', label: 'Paket Tersedia', icon: Package, group: 'LAYANAN' },
  { href: '/jamaah/profil', label: 'Profil Saya', icon: UserIcon, group: 'PENGATURAN' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<{ email?: string; name?: string; role?: string } | null>(null)

  const isLoginPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login')

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserProfile({
          email: session.user.email,
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0],
          role: pathname?.startsWith('/agent')
            ? 'Agen'
            : pathname?.startsWith('/jamaah')
              ? 'Jamaah'
              : 'Staff Admin',
        })
      }
    }
    loadUser()
  }, [pathname])

  if (isLoginPage) {
    return <>{children}</>
  }

  const isJamaah = pathname?.startsWith('/jamaah')
  const isAgent = pathname?.startsWith('/agent')
  const menu = isAgent ? AGENT_MENU : isJamaah ? JAMAAH_MENU : ADMIN_MENU
  const panelTitle = isJamaah ? 'Portal Jamaah' : isAgent ? 'Portal Agen' : 'Admin Control Hub'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Get current active title
  const activeItem = menu.find((item) => (item.exact ? pathname === item.href : pathname?.startsWith(item.href)))
  const pageTitle = activeItem ? activeItem.label : 'Dashboard'

  // Group menu items
  const groups = Array.from(new Set(menu.map((i) => i.group || 'MENU')))

  return (
    <div className="min-h-screen bg-[#f8faf8] font-sans flex text-foreground">
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-[#0c2417] text-white shrink-0 hidden md:flex flex-col border-r border-[#1a442e]/60 shadow-xl z-20">
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0c2417] font-serif font-bold shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block leading-tight">
                MQH<span className="text-amber-400">·</span>Tour
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-amber-300/80 flex items-center gap-1">
                <Sparkles className="size-2.5 text-amber-400 inline" /> {panelTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
          {groups.map((group) => {
            const items = menu.filter((i) => (i.group || 'MENU') === group)
            return (
              <div key={group} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 mb-1.5">
                  {group}
                </p>
                {items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname?.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-emerald-600/40 to-amber-600/20 text-amber-300 border-l-3 border-amber-400 font-semibold shadow-sm translate-x-0.5'
                          : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${active ? 'text-amber-400' : 'text-emerald-300/60'}`} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* User Profile & Actions Footer */}
        <div className="p-3 border-t border-white/10 bg-[#081c12]/60 space-y-2">
          {userProfile && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-emerald-600 flex items-center justify-center font-bold text-xs text-white shadow-inner shrink-0">
                {(userProfile.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-white truncate leading-tight">
                  {userProfile.name}
                </p>
                <p className="text-[10.5px] text-emerald-300/60 truncate">
                  {userProfile.email}
                </p>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                {userProfile.role}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 text-[11.5px] text-emerald-200/70 hover:text-white hover:bg-white/10 justify-center gap-1.5 rounded-md"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3" /> Web Publik
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 text-[11.5px] text-red-300 hover:text-red-100 hover:bg-red-500/20 justify-center gap-1.5 rounded-md"
            >
              <LogOut className="size-3" /> Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0c2417] text-white px-4 py-3 flex justify-between items-center border-b border-[#1a442e] shadow-lg">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-base">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-[#0c2417] text-xs font-bold">
            M
          </div>
          <span>MQH<span className="text-amber-400">·</span>Tour</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="w-[280px] h-full bg-[#0c2417] text-white flex flex-col pt-16 pb-6 px-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              {menu.map((item) => {
                const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active ? 'bg-amber-500 text-[#0c2417] font-semibold' : 'text-emerald-100/70 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full text-xs text-white border-white/20 justify-center">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5 mr-1" /> Buka Web Publik
                </a>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full text-xs justify-center">
                <LogOut className="size-3.5 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Breadcrumb Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="size-3.5 text-emerald-600" />
            <span className="font-medium text-gray-700">{panelTitle}</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 p-4 md:p-8 bg-[#f8faf8]">
          {children}
        </main>
      </div>
    </div>
  )
}
