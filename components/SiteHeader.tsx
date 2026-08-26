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
      <DropdownMenuTrigger className="flex items-center gap-1 text-[0.875rem] font-semibold text-primary transition hover:text-secondary-hover focus-visible:ring-2 focus-visible:ring-secondary rounded outline-none data-[state=open]:text-secondary-hover">
        {label} <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="border border-border shadow-lg">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="text-[0.85rem] font-medium">{item.label}</Link>
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
    `text-[0.875rem] font-semibold transition-all duration-300 ${
      pathname === href
        ? 'text-secondary-hover'
        : 'text-primary hover:text-secondary-hover'
    }`

  const mobileLinkClass = (href: string) =>
    `text-[1rem] ${pathname === href ? 'text-secondary-hover font-bold' : 'text-primary font-semibold'}`

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-[400ms] cubic-bezier(0.4,0,0.2,1) ${
      scrolled
        ? 'bg-white/95 backdrop-blur-[16px] shadow-[var(--shadow-md)] py-3'
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg font-serif">M</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-[1.25rem] font-bold text-primary leading-tight">MQH</p>
            <p className="text-[0.65rem] uppercase tracking-[2px] text-muted-foreground leading-none">Tour & Travel</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
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
          <Button asChild className="bg-secondary text-white hover:bg-secondary-hover shadow-[var(--shadow-gold)] hover:shadow-[var(--shadow-gold-hover)] hover:-translate-y-0.5 transition-all duration-300 rounded-lg px-6 py-2.5 text-[0.85rem] font-semibold">
            <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
              Konsultasi
            </a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center lg:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Buka menu navigasi"
                className="text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded p-1"
              >
                {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[320px] border-l border-border">
              <SheetHeader className="border-b border-border pb-4 mb-4">
                <SheetTitle className="font-serif text-xl font-bold text-primary">
                  MQH<span className="text-secondary">·</span>Tour
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-2 pb-6 overflow-y-auto">
                <SheetClose asChild>
                  <Link href="/" className={`py-3 px-3 rounded-lg ${mobileLinkClass('/')}`}>Beranda</Link>
                </SheetClose>
                <div className="py-3 px-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-secondary mb-3">Paket</p>
                  <div className="flex flex-col gap-1 pl-2 border-l-2 border-secondary/20">
                    <SheetClose asChild>
                      <Link href="/paket?kategori=umroh" className="text-[0.85rem] text-muted-foreground hover:text-primary transition py-1.5">Paket Umroh</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/paket?kategori=haji" className="text-[0.85rem] text-muted-foreground hover:text-primary transition py-1.5">Paket Haji</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/paket?kategori=tour" className="text-[0.85rem] text-muted-foreground hover:text-primary transition py-1.5">Halal Tour</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/paket?tier=Privat" className="text-[0.85rem] text-muted-foreground hover:text-primary transition py-1.5">Privat Umroh</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/tabungan-umroh" className="text-[0.85rem] text-muted-foreground hover:text-primary transition py-1.5">Tabungan Umroh</Link>
                    </SheetClose>
                  </div>
                </div>
                <SheetClose asChild>
                  <Link href="/artikel" className={`py-3 px-3 rounded-lg ${mobileLinkClass('/artikel')}`}>Artikel</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/tentang" className={`py-3 px-3 rounded-lg ${mobileLinkClass('/tentang')}`}>Tentang</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/kontak" className={`py-3 px-3 rounded-lg ${mobileLinkClass('/kontak')}`}>Kontak</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/partnership" className={`py-3 px-3 rounded-lg ${mobileLinkClass('/partnership')}`}>Partnership</Link>
                </SheetClose>
                <div className="mt-4 px-3">
                  <Button asChild className="w-full bg-secondary text-white hover:bg-secondary-hover shadow-[var(--shadow-gold)] rounded-lg py-2.5 text-[0.85rem] font-semibold">
                    <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
                      Konsultasi Sekarang
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}