'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  ChevronsRight,
  Menu as MenuIcon,
  X,
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
  { href: '/admin/master', label: 'Master Data', icon: Database, group: 'PENGATURAN' },
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
  const panelTitle = isJamaah ? 'Portal Jamaah' : isAgent ? 'Portal Agen' : 'Control Hub'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const activeItem = menu.find((item) => (item.exact ? pathname === item.href : pathname?.startsWith(item.href)))
  const pageTitle = activeItem ? activeItem.label : 'Dashboard'

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans antialiased selection:bg-[#E6B472]/30 selection:text-foreground">
      {/* Desktop Collapsible Sidebar — clean minimal (referensi flat list) */}
      <aside
        className={`sticky top-0 h-screen shrink-0 border-r border-border/60 bg-background transition-all duration-300 ease-in-out z-20 hidden md:flex flex-col relative ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Brand: logo mark kecil saja */}
        <div className="px-3 pt-5 pb-2">
          <Link
            href="/"
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted/60 transition-colors overflow-hidden"
          >
            <div className="grid size-9 shrink-0 place-content-center rounded-xl bg-gradient-to-br from-[#E6B472] to-[#D9A25C] text-[#111827] font-serif font-bold text-base">
              M
            </div>
            {sidebarOpen && (
              <span className="transition-opacity duration-200 min-w-0 text-sm font-semibold text-foreground leading-tight truncate">
                MQH<span className="text-[#E6B472]">·</span>Tour
              </span>
            )}
          </Link>
        </div>

        {/* Menu Items List — flat, tanpa background block */}
        <nav className="flex-1 px-2 pt-2 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menu.map((item) => {
            const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex h-11 w-full items-center rounded-xl transition-colors duration-200 ${
                  active
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <div className="grid h-full w-12 place-content-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                {sidebarOpen && (
                  <span className="text-sm transition-opacity duration-200 truncate pr-2">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info — compact 1 baris + 2 ikon kecil */}
        {userProfile && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2">
              <div className="w-7 h-7 rounded-full bg-[#E6B472] text-[#111827] flex items-center justify-center font-bold text-[10px] shrink-0">
                {(userProfile.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate leading-tight">{userProfile.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate leading-tight">{userProfile.role}</p>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka Web"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Toggle — icon kecil saja */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="border-t border-border/60 transition-colors hover:bg-muted/60 grid place-content-center p-3 text-muted-foreground hover:text-foreground w-full"
          aria-label={sidebarOpen ? 'Perkecil Sidebar' : 'Perbesar Sidebar'}
        >
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-muted-foreground ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card text-foreground px-4 py-3 flex justify-between items-center border-b border-border shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-base">
          <div className="w-7 h-7 rounded-lg bg-[#E6B472] flex items-center justify-center text-[#111827] text-xs font-bold">
            M
          </div>
          <span>MQH<span className="text-[#E6B472]">·</span>Tour</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="w-[280px] h-full bg-card text-foreground flex flex-col pt-16 pb-6 px-4 shadow-2xl border-r border-border"
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? 'text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="pt-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="size-4" /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0 bg-background">
        {/* Content Header */}
        {/* Header row removed — content starts directly with page title inside main */}

        {/* Body Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
