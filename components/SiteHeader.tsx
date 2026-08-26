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
      <DropdownMenuTrigger className="group relative inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/80 hover:text-white transition-colors duration-300 focus-visible:outline-none py-1">
        {label}
        <ChevronDown className="size-3.5 opacity-70 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
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

  return (
    <nav
      className="fixed top-0 w-full"
      style={{
        zIndex: 1100,
        background: scrolled ? 'rgba(7,31,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        padding: scrolled ? '0' : '16px 0',
      }}
    >
      <div
              className="max-w-[1200px] mx-auto px-6 md:px-8 flex justify-between items-center"
              style={{
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" style={{ transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="shrink-0" style={{
            width: scrolled ? '40px' : '44px',
            height: scrolled ? '40px' : '44px',
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            background: '#c8956c',
          }}>
            <span className="text-white font-bold font-serif" style={{
              fontSize: scrolled ? '18px' : '20px',
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}>M</span>
          </div>
          <div className="hidden sm:block" style={{ opacity: scrolled ? 0.8 : 1, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
            <p className="font-serif font-bold text-white leading-tight" style={{
              fontSize: scrolled ? '18px' : '20px',
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              fontFamily: 'Playfair Display, Georgia, serif',
            }}>MQH</p>
            <p className="text-[10px] uppercase tracking-[2px] text-white/50 leading-none" style={{ opacity: scrolled ? 0 : 1, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>Tour & Travel</p>
          </div>
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

        {/* Desktop CTA — scales with navbar */}
                <div className="hidden min-[900px]:flex items-center" style={{ transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                  <Button asChild
                    className="text-[14px] font-semibold text-white rounded-lg transition-all duration-300"
                    style={{
                      background: '#c8956c',
                      boxShadow: '0 2px 8px rgba(26,92,58,0.2)',
                      padding: scrolled ? '6px 16px' : '8px 20px',
                      fontSize: scrolled ? '13px' : '14px',
                      borderRadius: '8px',
                      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
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
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,92,58,0.2)'
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
          background: '#071f14',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-0.5">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/' ? '#c8956c' : '#1a1a2e' }}>Beranda</Link>
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
          <Link href="/artikel" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/artikel' ? '#c8956c' : '#1a1a2e' }}>Artikel</Link>
          <Link href="/tentang" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/tentang' ? '#c8956c' : '#1a1a2e' }}>Tentang</Link>
          <Link href="/kontak" onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-lg text-[16px] font-semibold transition-colors" style={{ color: pathname === '/kontak' ? '#c8956c' : '#1a1a2e' }}>Kontak</Link>
          <div className="mt-3 px-3">
            <Button asChild className="w-full text-[14px] font-semibold text-white rounded-lg py-3" style={{ background: '#c8956c', boxShadow: '0 2px 8px rgba(26,92,58,0.2)' }}>
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