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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type DropdownItem = { href: string; label: string }

function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-[0.85rem] font-medium text-white/80 transition hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary rounded outline-none data-[state=open]:text-secondary">
        {label} <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white border border-border shadow-lg min-w-[200px]">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="text-[0.85rem] font-medium text-foreground hover:bg-muted transition-colors">{item.label}</Link>
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
    `text-[0.85rem] font-medium transition-colors duration-300 ${
      pathname === href
        ? 'text-secondary'
        : 'text-white/80 hover:text-white'
    }`

  const mobileLinkClass = (href: string) =>
    `text-[1rem] font-medium ${pathname === href ? 'text-secondary' : 'text-foreground'}`

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      scrolled
        ? 'bg-primary-darker/95 backdrop-blur-[16px] shadow-[var(--shadow-lg)]'
        : 'bg-primary-darker/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex justify-between items-center h-16 md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg font-serif">M</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-[1.125rem] font-bold text-white leading-tight">MQH</p>
            <p className="text-[0.6rem] uppercase tracking-[2px] text-white/50 leading-none">Tour & Travel</p>
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
          <Button asChild className="bg-secondary text-white hover:bg-secondary-hover shadow-[var(--shadow-gold)] hover:shadow-[var(--shadow-gold-hover)] hover:-translate-y-0.5 transition-all duration-300 rounded-lg px-5 py-2 text-[0.85rem] font-semibold">
            <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
              Konsultasi
            </a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="text-white focus:outline-none p-1"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-primary-darker border-t border-white/10 animate-fade-in-up">
          <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-1">
            <SheetClose asChild>
              <Link href="/" className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/')}`}>Beranda</Link>
            </SheetClose>
            <div className="py-3 px-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[3px] text-secondary mb-3">Paket</p>
              <div className="flex flex-col gap-1 pl-3 border-l-2 border-secondary/20">
                {[
                  { href: '/paket?kategori=umroh', label: 'Paket Umroh' },
                  { href: '/paket?kategori=haji', label: 'Paket Haji' },
                  { href: '/paket?kategori=tour', label: 'Halal Tour' },
                  { href: '/paket?tier=Privat', label: 'Privat Umroh' },
                  { href: '/tabungan-umroh', label: 'Tabungan Umroh' },
                ].map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link href={item.href} className="text-[0.85rem] text-foreground/70 hover:text-primary transition py-1.5">{item.label}</Link>
                  </SheetClose>
                ))}
              </div>
            </div>
            <SheetClose asChild>
              <Link href="/artikel" className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/artikel')}`}>Artikel</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/tentang" className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/tentang')}`}>Tentang</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/kontak" className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/kontak')}`}>Kontak</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/partnership" className={`py-3 px-3 rounded-lg transition-colors ${mobileLinkClass('/partnership')}`}>Partnership</Link>
            </SheetClose>
            <div className="mt-3 px-3">
              <Button asChild className="w-full bg-secondary text-white hover:bg-secondary-hover shadow-[var(--shadow-gold)] rounded-lg py-2.5 text-[0.85rem] font-semibold">
                <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
                  Konsultasi Sekarang
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}