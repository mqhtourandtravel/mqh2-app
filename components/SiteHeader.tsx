'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { NOMOR_WA } from '@/lib/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type DropdownItem = { href: string; label: string }

type NavCategory = {
  label: string
  items: DropdownItem[]
}

const paketItems: DropdownItem[] = [
  { href: '/paket?kategori=umroh', label: 'Paket Umroh' },
  { href: '/paket?kategori=haji', label: 'Paket Haji' },
  { href: '/paket?tier=Privat', label: 'Privat Umroh' },
  { href: '/paket?kategori=tour', label: 'Halal Tour' },
  { href: '/paket?kategori=badal', label: 'Badal Umroh' },
]

const programItems: DropdownItem[] = [
  { href: '/tabungan-umroh', label: 'Tabungan Umroh' },
  { href: '/partnership', label: 'Partnership' },
]

const informasiItems: DropdownItem[] = [
  { href: '/artikel', label: 'Artikel' },
  { href: '/tentang', label: 'Tentang MQH' },
  { href: '/kontak', label: 'Kontak' },
]

const mobileCategories: NavCategory[] = [
  { label: 'Paket', items: paketItems },
  { label: 'Program', items: programItems },
  { label: 'Informasi', items: informasiItems },
]

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
        className="group relative inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-[#E6B472] transition-colors duration-150 focus-visible:outline-none py-1"
      >
        <span>{label}</span>
        <ChevronDown className="size-3.5 opacity-70 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className="bg-neutral-900/60 backdrop-blur-2xl backdrop-saturate-[1.8] border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl min-w-[220px] p-1.5 text-white"
      >
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className="text-sm font-medium text-white/90 hover:text-[#E6B472] hover:bg-white/10 rounded-xl transition-colors px-3 py-2 cursor-pointer block"
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroActive, setHeroActive] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

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

  const isGlassActive = scrolled || menuOpen

  const navLinkClass = (href: string) =>
    cn(
      "block text-sm font-semibold transition-colors duration-150 py-1",
      pathname === href ? "text-[#E6B472]" : "text-white/90 hover:text-[#E6B472]"
    )

  return (
    <header>
      <nav
        id="main-navbar"
        data-state={menuOpen ? "active" : undefined}
        className={cn(
          "fixed top-0 inset-x-0 z-[1100] transition-all duration-500 ease-out",
          heroActive && "opacity-0 -translate-y-full pointer-events-none",
          !heroActive && "opacity-100 translate-y-0 pointer-events-auto"
        )}
      >
        <div
          className={cn(
            "relative transition-all duration-500 ease-out",
            isGlassActive
              ? "bg-neutral-900/35 backdrop-blur-2xl backdrop-saturate-[1.8] border-b border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_-1px_0_0_rgba(255,255,255,0.04),0_8px_30px_-8px_rgba(0,0,0,0.45)]"
              : "bg-transparent"
          )}
        >
          {/* Glass glare & specular reflection layers (Kafiyah style) */}
          {isGlassActive && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <div className="absolute -inset-x-1/4 -top-3/4 h-40 rotate-2 bg-gradient-to-b from-white/15 via-white/0 to-transparent" />
            </div>
          )}

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-4 sm:gap-6">
            {/* Left: Logo + Vertical Divider + Nav Links */}
            <div className="flex h-full items-center gap-4 lg:gap-8">
              <Link href="/" className="flex items-center shrink-0" aria-label="MQH Tour & Travel Home">
                <Image
                  src="/logo.png"
                  alt="MQH Logo"
                  width={493}
                  height={220}
                  className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[140px] rounded-md object-contain"
                  priority
                />
              </Link>

              <Separator className="hidden lg:block h-6 bg-white/20" orientation="vertical" />

              <div className="hidden lg:block">
                <ul className="flex items-center gap-6 lg:gap-8 xl:gap-10 text-sm lg:text-[15px] font-semibold text-white">
                  <li>
                    <Link href="/" className={navLinkClass('/')}>
                      Beranda
                    </Link>
                  </li>
                  <li>
                    <NavDropdown label="Paket" items={paketItems} />
                  </li>
                  <li>
                    <Link href="/artikel" className={navLinkClass('/artikel')}>
                      Artikel
                    </Link>
                  </li>
                  <li>
                    <Link href="/tentang" className={navLinkClass('/tentang')}>
                      Tentang
                    </Link>
                  </li>
                  <li>
                    <Link href="/kontak" className={navLinkClass('/kontak')}>
                      Kontak
                    </Link>
                  </li>
                  <li>
                    <Link href="/partnership" className={navLinkClass('/partnership')}>
                      Partnership
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Pill CTA Buttons (Kafiyah style) */}
            <div className="hidden min-[900px]:flex items-center gap-2.5">
              <Button
                asChild
                className="bg-[#E6B472] text-neutral-900 hover:bg-[#D9A25C] text-sm lg:text-[15px] font-semibold px-4 lg:px-5 py-2 lg:py-2.5 rounded-full shadow-[0_4px_14px_rgba(230,180,114,0.35)] hover:shadow-[0_6px_20px_rgba(217,162,92,0.5)] transition-all duration-200 h-auto"
              >
                <a
                  href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi paket Umroh/Haji MQH Tour')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Konsultasi
                </a>
              </Button>
              <Button
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm lg:text-[15px] font-semibold px-4 lg:px-5 py-2 lg:py-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 h-auto"
              >
                <Link href="/admin/login">Login</Link>
              </Button>
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              id="tombol-menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Tutup Menu" : "Buka Menu"}
              className="relative z-20 block cursor-pointer p-2 text-white min-[900px]:hidden"
            >
              <Menu className={cn("size-6 duration-200 transition-all", menuOpen && "rotate-180 scale-0 opacity-0")} />
              <X className={cn("absolute inset-0 m-auto size-6 duration-200 transition-all", menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0")} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer & Backdrop */}
        {menuOpen && (
          <div className="min-[900px]:hidden fixed inset-0 z-[1200]">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Panel: Slide from RIGHT to LEFT, width 85% */}
            <div
              id="menu-mobile"
              className="fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-neutral-900/90 backdrop-blur-2xl backdrop-saturate-[1.8] border-l border-white/10 shadow-[-12px_0_40px_rgba(0,0,0,0.6)] px-5 pt-6 pb-8 animate-in slide-in-from-right duration-300 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6 text-white">
                {/* Header inside drawer: Logo + Close Button */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="MQH Logo"
                      width={493}
                      height={220}
                      className="h-8 w-auto max-w-[120px] object-contain"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Tutup Menu"
                    className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="size-6" />
                  </button>
                </div>

                {/* Nav Items List */}
                <ul className="space-y-2">
                  {/* 1. Beranda (Link tunggal, tanpa submenu, tanpa chevron) */}
                  <li>
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block font-bold text-[clamp(1.125rem,4vw,1.375rem)] py-2.5 transition-colors",
                        pathname === '/' ? "text-[#E6B472]" : "text-white/90 hover:text-[#E6B472]"
                      )}
                    >
                      Beranda
                    </Link>
                  </li>

                  {/* 2. Accordion Categories: Paket, Program, Informasi */}
                  {mobileCategories.map((cat) => {
                    const isExpanded = !!expandedCategories[cat.label]
                    const hasActiveChild = cat.items.some((it) => pathname === it.href.split('?')[0])

                    return (
                      <li key={cat.label} className="border-b border-white/5 pb-1">
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat.label)}
                          className="w-full flex items-center justify-between py-2.5 text-left font-bold text-[clamp(1.125rem,4vw,1.375rem)] transition-colors cursor-pointer"
                        >
                          <span className={cn(hasActiveChild ? "text-[#E6B472]" : "text-white/90 hover:text-[#E6B472]")}>
                            {cat.label}
                          </span>
                          <ChevronDown
                            className={cn(
                              "size-5 text-white/70 shrink-0 transition-transform duration-200",
                              isExpanded && "rotate-180 text-[#E6B472]"
                            )}
                          />
                        </button>

                        {/* Submenu Accordion Content */}
                        <div
                          className={cn(
                            "grid transition-all duration-200 ease-in-out",
                            isExpanded ? "grid-rows-[1fr] opacity-100 mt-1 mb-2" : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="flex flex-col space-y-2 pl-3 border-l-2 border-[#E6B472]/40 ml-1">
                              {cat.items.map((item) => {
                                const isActive = pathname === item.href.split('?')[0]
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                      "text-sm font-medium py-1.5 transition-colors block",
                                      isActive ? "text-[#E6B472] font-semibold" : "text-white/75 hover:text-[#E6B472]"
                                    )}
                                  >
                                    {item.label}
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Bottom CTA Area */}
              <div className="space-y-3 pt-6 border-t border-white/10 mt-6">
                <Button
                  asChild
                  className="w-full bg-[#E6B472] text-neutral-900 hover:bg-[#D9A25C] text-sm font-semibold py-3 h-auto rounded-full shadow-[0_4px_14px_rgba(230,180,114,0.35)] transition-all"
                >
                  <a
                    href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi paket Umroh/Haji MQH Tour')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Konsultasi
                  </a>
                </Button>
                <Button
                  asChild
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold py-3 h-auto rounded-full backdrop-blur-md transition-all"
                >
                  <Link href="/admin/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
