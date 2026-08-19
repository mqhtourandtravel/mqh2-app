'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu } from 'lucide-react'
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
      <DropdownMenuTrigger className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition hover:text-primary focus-visible:ring-2 focus-visible:ring-secondary-hover rounded outline-none data-[state=open]:text-primary">
        {label} <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
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
    `text-[13px] font-medium transition ${
      pathname === href
        ? 'text-secondary-hover font-semibold border-b-2 border-secondary-hover pb-0.5'
        : 'text-muted-foreground hover:text-primary border-b-2 border-transparent pb-0.5'
    }`

  const mobileLinkClass = (href: string) =>
    `text-[14px] ${pathname === href ? 'text-secondary-hover font-bold' : 'text-primary font-semibold'}`

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary">
          MQH<span className="text-secondary">·</span>Tour
        </Link>

        {/* Desktop nav — grouped together for consistent baseline */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className={navLinkClass('/')}>Home</Link>

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

          <NavDropdown
            label="Cabang"
            items={[
              { href: '/cabang?tipe=pusat', label: 'Cabang Pusat' },
              { href: '/cabang?tipe=representatif', label: 'Cabang Representatif' },
            ]}
          />

          <Link href="/artikel" aria-current={pathname === '/artikel' ? 'page' : undefined} className={navLinkClass('/artikel')}>Artikel</Link>
          <Link href="/tentang" aria-current={pathname === '/tentang' ? 'page' : undefined} className={navLinkClass('/tentang')}>About Us</Link>
          <Link href="/kontak" aria-current={pathname === '/kontak' ? 'page' : undefined} className={navLinkClass('/kontak')}>Contact</Link>
          <Link href="/partnership" aria-current={pathname === '/partnership' ? 'page' : undefined} className={navLinkClass('/partnership')}>Partnership</Link>
        </div>

        {/* Desktop CTA button — separated from nav */}
        <div className="hidden md:flex items-center">
          <Button asChild variant="secondary" className="hover:shadow-lg hover:scale-105 transition-all">
            <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
              Konsultasi
            </a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Buka menu navigasi"
                className="text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-hover rounded"
              >
                <Menu className="size-7" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5">
              <SheetHeader>
                <SheetTitle>
                  MQH<span className="text-secondary">·</span>Tour
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-6 pb-6 overflow-y-auto">
                <SheetClose asChild>
                  <Link href="/" className={mobileLinkClass('/')}>Home</Link>
                </SheetClose>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-secondary-hover mb-2">Paket</p>
                  <div className="flex flex-col gap-2 pl-2">
                    <SheetClose asChild>
                      <Link href="/paket?kategori=umroh" className="text-[13px] text-muted-foreground">Paket Umroh</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/paket?kategori=haji" className="text-[13px] text-muted-foreground">Paket Haji</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/paket?kategori=tour" className="text-[13px] text-muted-foreground">Halal Tour</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/paket?tier=Privat" className="text-[13px] text-muted-foreground">Privat Umroh</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/tabungan-umroh" className="text-[13px] text-muted-foreground">Tabungan Umroh</Link>
                    </SheetClose>
                  </div>
                </div>
                <SheetClose asChild>
                  <Link href="/cabang" className={mobileLinkClass('/cabang')}>Cabang</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/artikel" className={mobileLinkClass('/artikel')}>Artikel</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/tentang" className={mobileLinkClass('/tentang')}>About Us</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/kontak" className={mobileLinkClass('/kontak')}>Contact</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/partnership" className={mobileLinkClass('/partnership')}>Partnership</Link>
                </SheetClose>
                <Button asChild variant="secondary" className="mt-2 w-full">
                  <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer">
                    Konsultasi
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
