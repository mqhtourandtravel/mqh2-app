'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NOMOR_PPIU, NOMOR_PIHK, NOMOR_WA, INSTAGRAM_URL } from '@/lib/config'

import { type LucideIcon, ArrowRight, BadgeCheck, ChevronRight, Clock, Headphones, Mail, MapPin, Menu, Phone, PhoneCall, PlaneTakeoff, ShieldCheck, Star } from 'lucide-react'

// Resolver ikon data-driven: pengganti Material Symbols (zero external request)
const ICON_MAP: Record<string, LucideIcon> = {
  arrow_forward: ArrowRight,
  call: Phone,
  chevron_right: ChevronRight,
  contact_phone: PhoneCall,
  flight_takeoff: PlaneTakeoff,
  headset_mic: Headphones,
  location_on: MapPin,
  mail: Mail,
  menu: Menu,
  phone: Phone,
  schedule: Clock,
  star: Star,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
}

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name]
  return Cmp ? <Cmp className={className} aria-hidden="true" /> : null
}


const mainMenu = [
  { href: '/', label: 'Beranda', icon: 'home' },
  { href: '/paket', label: 'Paket Umrah', icon: 'flight_takeoff' },
  { href: '/paket?kategori=haji', label: 'Paket Haji', icon: 'mosque' },
  { href: '/tabungan-umroh', label: 'Tabungan Umroh', icon: 'savings' },
  { href: '/artikel', label: 'Artikel & Panduan', icon: 'article' },
  { href: '/tentang', label: 'Tentang Kami', icon: 'info' },
  { href: '/partnership', label: 'Kemitraan & Agen', icon: 'handshake' },
  { href: '/kontak', label: 'Hubungi Kami', icon: 'call' },
] as const

const services = [
  { href: '/paket?kategori=umroh', label: 'Umrah Reguler' },
  { href: '/paket?tier=Privat', label: 'Umrah Privat / VIP' },
  { href: '/paket?kategori=haji', label: 'Haji Plus & Khusus' },
  { href: '/tabungan-umroh', label: 'Tabungan Umroh Syariah' },
  { href: '/paket?kategori=tour', label: 'Halal Tour Internasional' },
  { href: '/paket?kategori=badal', label: 'Badal Umroh & Haji' },
  { href: '/cabang', label: 'Layanan Cabang & Perwakilan' },
  { href: '/kontak', label: 'Konsultasi Perjalanan' },
] as const

const trustFeatures = [
  {
    icon: 'verified_user',
    title: 'Aman & Terpercaya',
    desc: 'Berizin resmi Kemenag RI dengan rekam jejak keberangkatan pasti.',
  },
  {
    icon: 'supervisor_account',
    title: 'Pembimbing Profesional',
    desc: 'Muthawif bersertifikat & berpengalaman mendampingi ibadah sesuai sunnah.',
  },
  {
    icon: 'apartment',
    title: 'Akomodasi Terbaik',
    desc: 'Hotel berbintang dengan lokasi strategis dekat Masjidil Haram & Nabawi.',
  },
  {
    icon: 'payments',
    title: 'Harga Transparan',
    desc: 'Semua rincian biaya jelas tanpa biaya tersembunyi selama perjalanan.',
  },
] as const

export default function SiteFooter() {
  const pathname = usePathname()
  const [openAccordion, setOpenAccordion] = useState<string | null>('hubungi')

  // Jangan render footer jika di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <>
      <footer className="bg-primary text-primary-foreground relative overflow-hidden" role="contentinfo">
        {/* Geometric Overlay Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1280px] mx-auto px-5 md:px-16 pt-12 md:pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
            
            {/* 1. BRAND INFO & LEGAL LICENSE BADGE */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <p className="font-serif text-2xl font-bold tracking-tight text-primary-foreground">
                  MQH<span className="text-secondary">·</span>TOUR & TRAVEL
                </p>
                <p className="text-[11px] uppercase tracking-[0.04em] text-secondary font-medium mt-1">
                  Biro Perjalanan Haji & Umrah Resmi
                </p>
              </div>

              <p className="text-[13.5px] leading-relaxed text-sidebar-muted">
                Biro perjalanan Haji & Umrah yang mengutamakan amanah, kenyamanan, pelayanan profesional, dan pengalaman ibadah yang berkesan.
              </p>

              {/* Legal License Card */}
              <div className="p-3.5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="" aria-hidden="true" />
                    <span className="text-[12.5px] font-semibold text-primary-foreground">Izin Resmi Kemenag RI</span>
                  </div>
                  <div className="text-[11.5px] text-sidebar-muted pl-6 space-y-0.5">
                    <p>PPIU: <span className="text-primary-foreground font-medium">{NOMOR_PPIU}</span></p>
                    {NOMOR_PIHK && <p>PIHK: <span className="text-primary-foreground font-medium">{NOMOR_PIHK}</span></p>}
                  </div>
                </div>
                {/* Official Kemenag Badge Emblem Icon */}
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 border border-secondary/20">
                  <BadgeCheck className="" aria-hidden="true" />
                </div>
              </div>

              {/* Social Links Row */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram MQH Tour"
                  className="w-10 h-10 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-sidebar-muted hover:text-secondary hover:bg-primary-foreground/10 transition"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${NOMOR_WA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp MQH Tour"
                  className="w-10 h-10 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-sidebar-muted hover:text-secondary hover:bg-primary-foreground/10 transition"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>
              </div>

              {/* Help CTA Box Card (Mobile & Desktop) */}
              <div className="p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 space-y-2.5">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Headphones className="" aria-hidden="true" />
                  <p className="text-[13px] font-semibold">Butuh Bantuan?</p>
                </div>
                <p className="text-[11.5px] text-sidebar-muted leading-relaxed">
                  Konsultasikan kebutuhan perjalanan Haji & Umrah Anda bersama tim MQH.
                </p>
                <a
                  href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi paket Umroh/Haji MQH Tour')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-secondary text-primary font-semibold text-[12.5px] hover:bg-secondary-hover hover:text-primary-foreground transition-all shadow-sm"
                >
                  <span>Konsultasikan Sekarang</span>
                  <ArrowRight className="" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* 2. DESKTOP NAVIGATION COLUMNS (Hidden on Mobile) */}
            <div className="hidden lg:grid lg:col-span-8 grid-cols-3 gap-8">
              {/* Col: Menu Utama */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-primary-foreground text-[13px] font-semibold uppercase tracking-[0.04em]">
                    Menu Utama
                  </h4>
                  <div className="w-8 h-0.5 bg-secondary mt-1.5 rounded-full" />
                </div>
                <ul className="space-y-2.5 text-[13.5px]">
                  {mainMenu.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sidebar-muted hover:text-secondary transition-colors inline-flex items-center gap-2 group"
                      >
                        <Icon name={ item.icon } className="text-[15px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col: Layanan Kami */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-primary-foreground text-[13px] font-semibold uppercase tracking-[0.04em]">
                    Layanan Kami
                  </h4>
                  <div className="w-8 h-0.5 bg-secondary mt-1.5 rounded-full" />
                </div>
                <ul className="space-y-2.5 text-[13.5px]">
                  {services.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sidebar-muted hover:text-secondary transition-colors inline-flex items-center gap-2 group"
                      >
                        <ChevronRight className="" aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col: Hubungi Kami */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-primary-foreground text-[13px] font-semibold uppercase tracking-[0.04em]">
                    Hubungi Kami
                  </h4>
                  <div className="w-8 h-0.5 bg-secondary mt-1.5 rounded-full" />
                </div>

                <address className="not-italic space-y-3 text-[13px] text-sidebar-muted">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="" aria-hidden="true" />
                    <span>Pekalongan, Jawa Tengah, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="" aria-hidden="true" />
                    <a href={`https://wa.me/${NOMOR_WA}`} className="hover:text-secondary transition">+62 858-6896-9000</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="" aria-hidden="true" />
                    <a href="mailto:info@mqhtourandtravel.com" className="hover:text-secondary transition">info@mqhtourandtravel.com</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="" aria-hidden="true" />
                    <span>Senin – Sabtu, 08.00 – 16.00 WIB</span>
                  </div>
                </address>
              </div>
            </div>

            {/* 3. MOBILE ACCORDION GROUP (Visible ONLY on Mobile md:hidden) */}
            <div className="lg:hidden col-span-1 border border-primary-foreground/10 rounded-2xl bg-primary-foreground/[0.02] overflow-hidden divide-y divide-primary-foreground/10 mt-2">
              
              {/* Accordion 1: Menu Utama */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('menu')}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-left font-semibold text-[13.5px] text-primary-foreground hover:bg-primary-foreground/5 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Menu className="" aria-hidden="true" />
                    Menu Utama
                  </span>
                  <Icon name={ openAccordion === 'menu' ? 'expand_less' : 'expand_more' } className="text-sidebar-muted text-[18px]" />
                </button>
                {openAccordion === 'menu' && (
                  <div className="px-4 pb-4 pt-1 space-y-2 text-[13px] bg-primary-foreground/[0.01]">
                    {mainMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 py-1.5 text-sidebar-muted hover:text-secondary transition"
                      >
                        <Icon name={ item.icon } className="text-[15px] opacity-60" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: Layanan Kami */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('layanan')}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-left font-semibold text-[13.5px] text-primary-foreground hover:bg-primary-foreground/5 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <PlaneTakeoff className="" aria-hidden="true" />
                    Layanan Kami
                  </span>
                  <Icon name={ openAccordion === 'layanan' ? 'expand_less' : 'expand_more' } className="text-sidebar-muted text-[18px]" />
                </button>
                {openAccordion === 'layanan' && (
                  <div className="px-4 pb-4 pt-1 space-y-2 text-[13px] bg-primary-foreground/[0.01]">
                    {services.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 py-1.5 text-sidebar-muted hover:text-secondary transition"
                      >
                        <ChevronRight className="" aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Hubungi Kami (Expanded by default) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('hubungi')}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-left font-semibold text-[13.5px] text-primary-foreground hover:bg-primary-foreground/5 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <PhoneCall className="" aria-hidden="true" />
                    Hubungi Kami
                  </span>
                  <Icon name={ openAccordion === 'hubungi' ? 'expand_less' : 'expand_more' } className="text-sidebar-muted text-[18px]" />
                </button>
                {openAccordion === 'hubungi' && (
                  <div className="px-4 pb-4 pt-1 space-y-3 text-[13px] text-sidebar-muted bg-primary-foreground/[0.01]">
                    <div className="flex items-start gap-2.5 pt-1">
                      <MapPin className="" aria-hidden="true" />
                      <span>Pekalongan, Jawa Tengah, Indonesia</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="" aria-hidden="true" />
                      <a href={`https://wa.me/${NOMOR_WA}`} className="hover:text-secondary transition">+62 858-6896-9000</a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="" aria-hidden="true" />
                      <a href="mailto:info@mqhtourandtravel.com" className="hover:text-secondary transition">info@mqhtourandtravel.com</a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="" aria-hidden="true" />
                      <span>Senin – Sabtu, 08.00 – 16.00 WIB</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Keunggulan Kami */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('keunggulan')}
                  className="w-full py-3.5 px-4 flex items-center justify-between text-left font-semibold text-[13.5px] text-primary-foreground hover:bg-primary-foreground/5 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <BadgeCheck className="" aria-hidden="true" />
                    Keunggulan Kami
                  </span>
                  <Icon name={ openAccordion === 'keunggulan' ? 'expand_less' : 'expand_more' } className="text-sidebar-muted text-[18px]" />
                </button>
                {openAccordion === 'keunggulan' && (
                  <div className="px-4 pb-4 pt-1 space-y-3 text-[12.5px] text-sidebar-muted bg-primary-foreground/[0.01]">
                    {trustFeatures.map((f) => (
                      <div key={f.title} className="space-y-0.5 pt-1">
                        <p className="font-semibold text-primary-foreground text-[13px]">{f.title}</p>
                        <p className="text-[12px] text-sidebar-muted">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* 4. VALUE GUARANTEE STRIP (Desktop Only) */}
        <div className="hidden lg:block relative border-y border-primary-foreground/10 bg-primary-foreground/[0.02]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {trustFeatures.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:border-secondary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0 text-secondary">
                    <Icon name={ item.icon } className="text-[22px]" />
                  </div>
                  <div>
                    <h5 className="font-serif text-[14px] font-bold text-primary-foreground leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-[12px] text-sidebar-muted mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. BRAND TAGLINE BANNER WITH 8-POINT STAR DIVIDER */}
        <div className="relative max-w-[1280px] mx-auto px-5 md:px-16 py-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4 opacity-50">
            <div className="h-px bg-primary-foreground/20 w-16 md:w-32" />
            <Star className="" aria-hidden="true" />
            <div className="h-px bg-primary-foreground/20 w-16 md:w-32" />
          </div>
          <p className="text-[13.5px] md:text-[15px] text-sidebar-muted leading-relaxed max-w-xl mx-auto">
            Menemani perjalanan ibadah Anda dengan <strong className="text-primary-foreground font-semibold">amanah</strong> dan <strong className="text-primary-foreground font-semibold">profesional</strong>.
          </p>
        </div>

        {/* 6. COPYRIGHT & LEGAL BAR */}
        <div className="border-t border-primary-foreground/10 bg-primary/95">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-sidebar-muted text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} MQH Tour &amp; Travel. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11.5px]">
              <Link href="/tentang" className="hover:text-secondary transition">Kebijakan Privasi</Link>
              <span>&middot;</span>
              <Link href="/partnership" className="hover:text-secondary transition">Syarat &amp; Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a 
        href={`https://wa.me/${NOMOR_WA}`} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp MQH Tour"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[var(--shadow-lg-custom)] hover:scale-105 transition-all z-50 border border-border"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#25D366]">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.83 14.13c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.38.24-.26.53-.32.71-.32h.5c.16 0 .38-.01.59.46.24.53.79 1.85.86 1.98.07.13.12.29.02.47-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.7 1.16 1.51 1.88 1.04.93 1.91 1.22 2.19 1.36.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.13.44.19.51.3.07.11.07.6-.17 1.28z"/>
        </svg>
      </a>
    </>
  )
}