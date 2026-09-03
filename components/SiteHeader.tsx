'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DropdownItem = { href: string; label: string }

function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  function scheduleClose() {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        onMouseEnter={() => { cancelClose(); setOpen(true) }}
        onMouseLeave={scheduleClose}
        className="group relative inline-flex items-center gap-1.5 text-[14px] font-semibold text-white hover:text-[#c8956c] transition-colors duration-300 focus-visible:outline-none py-1"
      >
        {label}
        <ChevronDown className="size-3.5 opacity-70 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" style={{ color: 'inherit' }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className="bg-[rgba(22,57,38,0.5)] backdrop-blur-md border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,.2)] rounded-xl min-w-[220px] py-2"
      >
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="text-[14px] font-medium text-white hover:text-white hover:bg-white/15 transition-colors px-4 py-2.5 cursor-pointer">{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className="group relative text-[14px] font-semibold transition-colors duration-300 py-1"
      style={{ color: isActive ? '#c8956c' : '#ffffff' }}
    >
      <span className="group-hover:text-[#c8956c] transition-colors duration-300">{children}</span>
      {/* Underline animation — grows from center on hover */}
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ease-out"
        style={{
          width: isActive ? '60%' : '0%',
          background: isActive ? '#c8956c' : 'transparent',
        }}
      />
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ease-out group-hover:w-[60%]"
        style={{
          width: '0%',
          background: 'rgba(255,255,255,0.6)',
        }}
      />
    </Link>
  )
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroActive, setHeroActive] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      const atHero = pathname === '/' && window.scrollY < window.innerHeight * 0.5
      setHeroActive(atHero)
      setScrolled(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  useEffect(() => {
    if (heroActive) setMenuOpen(false)
  }, [heroActive])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <nav
      className="fixed top-0 w-full transition-all duration-300"
      style={{
        zIndex: 1100,
        opacity: heroActive ? 0 : 1,
        pointerEvents: heroActive ? 'none' : 'auto',
        transform: heroActive ? 'translateY(-100%)' : 'translateY(0)',
        background: scrolled ? 'rgba(22,57,38,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        height: '65px',
      }}
    >
      <div
        className="max-w-[1200px] mx-auto px-6 md:px-8 flex justify-between items-center"
        style={{
          height: '100%',
          alignItems: 'center',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Logo — fixed height, width auto untuk jaga rasio */}
        <Link href="/" className="flex items-center shrink-0" style={{ transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
          <Image src="/logo.png" alt="MQH Logo" width={493} height={220} className="h-11 w-auto rounded-md object-contain" priority />
        </Link>

        {/* Desktop nav — displayed ≥900px */}
        <div className="hidden min-[900px]:flex items-center gap-7">
          <NavLink href="/">Beranda</NavLink>

          <NavDropdown
            label="Paket"
            items={[
              { href: '/paket?kategori=umroh', label: 'Paket Umroh' },
              { href: '/paket?kategori=haji', label: 'Paket Haji' },
              { href: '/paket?kategori=tour', label: 'Halal Tour' },
              { href: '/paket?tier=Privat', label: 'Privat Umroh' },
              { href: '/paket?kategori=badal', label: 'Badal Umroh' },
              { href: '/tabungan-umroh', label: 'Tabungan Umroh' },
            ]}
          />

          <NavLink href="/artikel">Artikel</NavLink>
          <NavLink href="/tentang">Tentang</NavLink>
          <NavLink href="/kontak">Kontak</NavLink>
          <NavLink href="/partnership">Partnership</NavLink>
        </div>

        {/* Desktop CTA — tombol login */}
        <div className="hidden min-[900px]:flex items-center">
          <Button asChild className="nav-consultation nav-consultation-desktop">
            <Link href="/admin/login">Login and Book Now</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="min-[900px]:hidden text-white focus:outline-none p-1 transition-colors shrink-0"
          style={{ transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="min-[900px]:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          maxHeight: menuOpen ? '600px' : '0',
          background: '#163926',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-0.5">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/' ? '#c8956c' : '#ffffff' }}>Beranda</Link>
          <div className="py-3 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#c8956c] mb-3">Paket</p>
            <div className="flex flex-col gap-0.5 pl-3 border-l-2 border-[#c8956c]/20">
              {[
                { href: '/paket?kategori=umroh', label: 'Paket Umroh' },
                { href: '/paket?kategori=haji', label: 'Paket Haji' },
                { href: '/paket?kategori=tour', label: 'Halal Tour' },
                { href: '/paket?tier=Privat', label: 'Privat Umroh' },
                { href: '/tabungan-umroh', label: 'Tabungan Umroh' },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-[14px] font-medium text-white/60 hover:text-white transition-colors py-2">{item.label}</Link>
              ))}
            </div>
          </div>
          <Link href="/artikel" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/artikel' ? '#c8956c' : '#ffffff' }}>Artikel</Link>
          <Link href="/tentang" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/tentang' ? '#c8956c' : '#ffffff' }}>Tentang</Link>
          <Link href="/kontak" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/kontak' ? '#c8956c' : '#ffffff' }}>Kontak</Link>
          <Link href="/partnership" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/partnership' ? '#c8956c' : '#ffffff' }}>Partnership</Link>
          <div className="mt-3 px-3">
            <Button
              asChild
              className="nav-consultation nav-consultation-mobile"
            >
              <Link href="/admin/login">Login and Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}