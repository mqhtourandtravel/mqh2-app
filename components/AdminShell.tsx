'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

const MENU = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/paket', label: 'Paket & Jadwal' },
  { href: '/admin/artikel', label: 'Artikel' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/agents', label: 'Agen & Jamaah' },
  { href: '/admin/master', label: 'Master Data' },
]

const JAMAAH_MENU = [
  { href: '/jamaah', label: 'Booking Saya', exact: true },
  { href: '/jamaah/paket', label: 'Paket Tersedia' },
  { href: '/jamaah/profil', label: 'Profil' },
]

const AGENT_MENU = [
  { href: '/agent', label: 'Dashboard', exact: true },
  { href: '/agent/jamaah', label: 'Jamaah Binaan' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login')
  if (isLoginPage) {
    return <>{children}</>
  }

  const isJamaah = pathname?.startsWith('/jamaah')
  const isAgent = pathname?.startsWith('/agent')
  const menu = isAgent ? AGENT_MENU : isJamaah ? JAMAAH_MENU : MENU

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-muted font-sans flex">
      <aside className="w-[220px] bg-primary text-sidebar-muted shrink-0 hidden md:flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="font-serif text-lg font-bold text-primary-foreground">
            MQH<span className="text-secondary">·</span>Tour
          </Link>
          <p className="text-[10px] uppercase tracking-wide text-sidebar-muted/60 mt-1">
            {isJamaah ? 'Jamaah Panel' : isAgent ? 'Agent Panel' : 'Admin Panel'}
          </p>
        </div>
        <nav className="flex-1 py-4">
          {menu.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-6 py-3 text-[13px] font-medium border-l-2 transition ${
                  active
                    ? 'border-secondary text-secondary bg-white/5'
                    : 'border-transparent hover:text-secondary hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full text-sidebar-muted/70 hover:text-secondary hover:bg-white/5"
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              Lihat Situs <ExternalLink className="size-3.5" />
            </a>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-serif text-primary-foreground">MQH<span className="text-secondary">·</span>Tour</Link>
        <Button variant="ghost" size="sm" onClick={logout} className="text-sidebar-muted h-auto p-0 hover:bg-transparent hover:text-secondary">
          Logout
        </Button>
      </div>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="md:hidden overflow-x-auto flex gap-1 px-4 py-3 bg-white border-b border-accent">
          {menu.map((item) => (
            <Button key={item.href} asChild variant="outline" size="sm" className="whitespace-nowrap rounded-full">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
        {children}
      </main>
    </div>
  )
}
