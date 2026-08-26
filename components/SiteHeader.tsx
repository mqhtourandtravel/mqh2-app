'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { NOMOR_WA } from '@/lib/config'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DropdownItem = { href: string; label: string }

function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-[14px] font-semibold text-white/80 hover:text-secondary transition-colors duration-300 focus-visible:outline-none rounded">
        {label}
        <ChevronDown className="size-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white border border-black/5 shadow-[0_12px_40px_rgba(0,0,0,.12)] rounded-xl min-w-[220px] py-2">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors px-4 py-2.5 cursor-pointer">{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinkClass = (href: string) =>
    `text-[14px] font-semibold transition-colors duration-300 ${
      pathname === href
        ? 'text-secondary'
        : 'text-white/80 hover:text-white'
    }`

  const mobileLinkClass = (href: string) =>
    `text-[16px] font-semibold ${pathname === href ? 'text-secondary' : 'text-foreground'}`

  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: scrolled ? 'rgba(7,31,20,0.95)' : '#071f14',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex justify-between items-center" style={{ height: scrolled ? '56px' : '72px', transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: '#c8956c' }}>
            <span className="text-white font-bold text-lg font-serif">M</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-[20px] font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>MQH</p>
            <p className="text-[10px] uppercase tracking-[2px] text-white/50 leading-none">Tour & Travel</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className={navLinkClass('/')}>Beranda</Link>

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

          <Link href="/artikel" aria-current={pathname === '/artikel' ? 'page' : undefined} className={navLinkClass('/artikel')}>Artikel</Link>
          <Link href="/tentang" aria-current={pathname === '/tentang' ? 'page' : undefined} className={navLinkClass('/tentang')}>Tentang</Link>
          <Link href="/kontak" aria-current={pathname === '/kontak' ? 'page' : undefined} className={navLinkClass('/kontak')}>Kontak</Link>
          <Link href="/partnership" aria-current={pathname === '/partnership' ? 'page' : undefined} className={navLinkClass('/partnership')}>Partnership</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <Button asChild
            className="text-[14px] font-semibold text-white rounded-lg px-6 py-2.5 transition-all duration-300"
            style={{
              background: '#c8956c',
              boxShadow: '0 2px 12px rgba(200,149,108,0.4)',
            }}
          >
            <a
              href={`https://wa.me/${NOMOR_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b37f5a'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,149,108,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#c8956c'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(200,149,108,0.4)'
              }}
            >
              Konsultasi
            </a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="lg:hidden text-white focus:outline-none p-1 transition-colors"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          maxHeight: menuOpen ? '600px' : '0',
          background: '#071f14',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-0.5">
          <Link href="/" onClick={() => setMenuOpen(false)} className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/')}`}>Beranda</Link>
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
          <Link href="/artikel" onClick={() => setMenuOpen(false)} className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/artikel')}`}>Artikel</Link>
          <Link href="/tentang" onClick={() => setMenuOpen(false)} className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/tentang')}`}>Tentang</Link>
          <Link href="/kontak" onClick={() => setMenuOpen(false)} className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/kontak')}`}>Kontak</Link>
          <Link href="/partnership" onClick={() => setMenuOpen(false)} className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/partnership')}`}>Partnership</Link>
          <div className="mt-3 px-3">
            <Button asChild className="w-full text-[14px] font-semibold text-white rounded-lg py-3" style={{ background: '#c8956c', boxShadow: '0 2px 12px rgba(200,149,108,0.4)' }}>
              <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
                Konsultasi Sekarang
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}