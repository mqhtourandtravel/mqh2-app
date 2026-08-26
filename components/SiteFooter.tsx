'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NOMOR_PPIU, NOMOR_PIHK, NOMOR_WA, INSTAGRAM_URL } from '@/lib/config'
import { ChevronDown, MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight } from 'lucide-react'

const mainMenu = [
  { href: '/', label: 'Beranda' },
  { href: '/paket', label: 'Paket Umroh' },
  { href: '/paket?kategori=haji', label: 'Paket Haji' },
  { href: '/tabungan-umroh', label: 'Tabungan Umroh' },
  { href: '/artikel', label: 'Artikel & Panduan' },
  { href: '/tentang', label: 'Tentang Kami' },
  { href: '/partnership', label: 'Kemitraan' },
  { href: '/kontak', label: 'Hubungi Kami' },
] as const

const services = [
  { href: '/paket?kategori=umroh', label: 'Umroh Reguler' },
  { href: '/paket?tier=Privat', label: 'Umroh Privat / VIP' },
  { href: '/paket?kategori=haji', label: 'Haji Plus & Khusus' },
  { href: '/tabungan-umroh', label: 'Tabungan Umroh Syariah' },
  { href: '/paket?kategori=tour', label: 'Halal Tour Internasional' },
  { href: '/paket?kategori=badal', label: 'Badal Umroh & Haji' },
  { href: '/kontak', label: 'Konsultasi Perjalanan' },
] as const

export default function SiteFooter() {
  const pathname = usePathname()
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  if (pathname?.startsWith('/admin')) return null

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <>
      <footer className="bg-[#071f14] text-white relative" role="contentinfo">
        {/* Gold top border */}
        <div className="h-[3px] bg-gradient-to-r from-secondary via-secondary-light to-secondary" />

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Brand */}
            <div className="space-y-5">
              <div>
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-lg font-serif">M</span>
                  </div>
                  <div>
                    <p className="font-serif text-[1.25rem] font-bold text-white leading-tight">MQH</p>
                    <p className="text-[0.65rem] uppercase tracking-[2px] text-white/50 leading-none">Tour & Travel</p>
                  </div>
                </Link>
              </div>

              <p className="text-[0.85rem] leading-relaxed text-white/60">
                Biro perjalanan Haji & Umrah yang mengutamakan amanah, kenyamanan, dan pengalaman ibadah yang berkesan.
              </p>

              {/* Legal */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <ShieldCheck className="text-secondary shrink-0" />
                <div>
                  <p className="text-[0.8rem] font-semibold text-white">Izin Resmi Kemenag RI</p>
                  <p className="text-[0.7rem] text-white/50">PPIU: {NOMOR_PPIU}</p>
                </div>
              </div>

              {/* Social */}
              <div className="flex items-center gap-2.5">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram MQH"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-secondary hover:bg-white/10 transition-all duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${NOMOR_WA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp MQH"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-secondary hover:bg-white/10 transition-all duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>
              </div>

              {/* CTA Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-[0.85rem] font-semibold text-white">Butuh Bantuan?</p>
                <p className="text-[0.75rem] text-white/50 leading-relaxed">
                  Konsultasikan kebutuhan perjalanan Haji & Umrah Anda bersama tim MQH.
                </p>
                <a
                  href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent('Assalamualaikum, saya ingin konsultasi paket Umroh/Haji MQH Tour')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-secondary text-white font-semibold text-[0.8rem] hover:bg-secondary-hover transition-all duration-300 shadow-[var(--shadow-gold)]"
                >
                  <span>Konsultasikan Sekarang</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Menu Utama */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[0.9rem] font-semibold text-secondary uppercase tracking-[2px]">Menu Utama</h4>
                <div className="w-10 h-[3px] bg-gradient-to-r from-secondary to-secondary-light mt-2 rounded-full" />
              </div>
              <ul className="space-y-2.5">
                {mainMenu.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[0.85rem] text-white/50 hover:text-secondary transition-colors duration-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[0.9rem] font-semibold text-secondary uppercase tracking-[2px]">Layanan Kami</h4>
                <div className="w-10 h-[3px] bg-gradient-to-r from-secondary to-secondary-light mt-2 rounded-full" />
              </div>
              <ul className="space-y-2.5">
                {services.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[0.85rem] text-white/50 hover:text-secondary transition-colors duration-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hubungi */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[0.9rem] font-semibold text-secondary uppercase tracking-[2px]">Hubungi Kami</h4>
                <div className="w-10 h-[3px] bg-gradient-to-r from-secondary to-secondary-light mt-2 rounded-full" />
              </div>
              <address className="not-italic space-y-4 text-[0.85rem] text-white/50">
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 mt-0.5 shrink-0 text-secondary" />
                  <span>Pekalongan, Jawa Tengah, Indonesia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-secondary" />
                  <a href={`https://wa.me/${NOMOR_WA}`} className="hover:text-secondary transition">+62 858-6896-9000</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-secondary" />
                  <a href="mailto:info@mqhtourandtravel.com" className="hover:text-secondary transition">info@mqhtourandtravel.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="size-4 shrink-0 text-secondary" />
                  <span>Senin – Sabtu, 08.00 – 16.00 WIB</span>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.8rem] text-white/30 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} MQH Tour &amp; Travel. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[0.75rem]">
              <Link href="/tentang" className="hover:text-secondary transition">Kebijakan Privasi</Link>
              <span>&middot;</span>
              <Link href="/partnership" className="hover:text-secondary transition">Syarat &amp; Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${NOMOR_WA}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp MQH"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px rgba(37,211,102,.4)] hover:scale-110 hover:shadow-[0_6px_24px rgba(37,211,102,.5)] transition-all duration-300 z-50"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.83 14.13c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.38.24-.26.53-.32.71-.32h.5c.16 0 .38-.01.59.46.24.53.79 1.85.86 1.98.07.13.12.29.02.47-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.7 1.16 1.51 1.88 1.04.93 1.91 1.22 2.19 1.36.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.13.44.19.51.3.07.11.07.6-.17 1.28z"/>
        </svg>
      </a>
    </>
  )
}