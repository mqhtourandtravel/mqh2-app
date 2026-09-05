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
  ChevronsRight,
  Menu as MenuIcon,
  X,
  Bell,
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
  const groups = Array.from(new Set(menu.map((i) => i.group || 'MENU')))

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans antialiased selection:bg-[#E6B472]/30 selection:text-foreground">
      {/* Desktop Collapsible Sidebar (gaya dashboard-with-collapsible-sidebar) */}
      <aside
        className={`sticky top-0 h-screen shrink-0 border-r border-border bg-card/95 backdrop-blur-2xl transition-all duration-300 ease-in-out z-20 hidden md:flex flex-col shadow-sm relative ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Title / Brand Header */}
        <div className="p-3 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted transition-colors overflow-hidden"
          >
            <div className="grid size-10 shrink-0 place-content-center rounded-xl bg-gradient-to-br from-[#E6B472] to-[#D9A25C] shadow-md text-[#111827] font-serif font-bold text-lg">
              M
            </div>
            {sidebarOpen && (
              <div className="transition-opacity duration-200 min-w-0">
                <span className="block text-sm font-bold text-foreground leading-tight truncate">
                  MQH<span className="text-[#E6B472]">·</span>Tour
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#E6B472] flex items-center gap-1 font-medium truncate">
                  <Sparkles className="size-2.5 inline" /> {panelTitle}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Menu Items List */}
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto custom-scrollbar">
          {groups.map((group) => {
            const items = menu.filter((i) => (i.group || 'MENU') === group)
            return (
              <div key={group} className="space-y-1">
                {sidebarOpen && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {group}
                  </p>
                )}
                {items.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!sidebarOpen ? item.label : undefined}
                      className={`relative flex h-11 w-full items-center rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-[#E6B472]/15 text-[#b07d3b] dark:text-[#E6B472] font-semibold border-l-2 border-[#E6B472] shadow-xs'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
              </div>
            )
          })}
        </nav>

        {/* User Info & Actions */}
        {sidebarOpen && userProfile && (
          <div className="p-3 border-t border-border bg-muted/40">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-card border border-border mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E6B472] text-[#111827] flex items-center justify-center font-bold text-xs shrink-0">
                {(userProfile.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{userProfile.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userProfile.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted justify-center gap-1 rounded-lg"
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3" /> Web
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 text-xs text-red-600 dark:text-red-300 hover:text-red-700 hover:bg-red-500/10 justify-center gap-1 rounded-lg"
              >
                <LogOut className="size-3" /> Keluar
              </Button>
            </div>
          </div>
        )}

        {/* Collapsible Toggle Button */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="border-t border-border transition-colors hover:bg-muted flex items-center p-3 text-muted-foreground hover:text-foreground"
          aria-label={sidebarOpen ? 'Perkecil Sidebar' : 'Perbesar Sidebar'}
        >
          <div className="grid size-10 place-content-center shrink-0">
            <ChevronsRight
              className={`h-4 w-4 transition-transform duration-300 text-[#E6B472] ${
                sidebarOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {sidebarOpen && (
            <span className="text-xs font-medium tracking-wide">
              Perkecil Menu
            </span>
          )}
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
                      active ? 'bg-[#E6B472] text-[#111827] font-semibold shadow-md' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full border-red-400/30 text-red-500 hover:bg-red-500/10 rounded-xl"
              >
                <LogOut className="size-4 mr-2" /> Keluar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0 bg-background">
        {/* Content Header */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-[#E6B472] rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="size-8 rounded-full bg-[#E6B472] text-[#111827] flex items-center justify-center font-bold text-xs">
                {(userProfile?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-foreground hidden sm:inline">
                {userProfile?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
