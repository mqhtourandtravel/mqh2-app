'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { NOMOR_PPIU, NOMOR_PIHK, NOMOR_WA, INSTAGRAM_URL } from '@/lib/config'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}


const mqhSections = [
  {
    title: 'Paket & Layanan',
    links: [
      { name: 'Paket Umroh Reguler', href: '/paket?kategori=umroh' },
      { name: 'Umroh Privat / VIP', href: '/paket?tier=Privat' },
      { name: 'Haji Plus & Khusus', href: '/paket?kategori=haji' },
      { name: 'Halal Tour Mancanegara', href: '/paket?kategori=tour' },
      { name: 'Badal Umroh & Haji', href: '/paket?kategori=badal' },
      { name: 'Tabungan Umroh Syariah', href: '/tabungan-umroh' },
    ],
  },
  {
    title: 'Navigasi',
    links: [
      { name: 'Beranda', href: '/' },
      { name: 'Katalog Paket', href: '/paket' },
      { name: 'Artikel & Panduan', href: '/artikel' },
      { name: 'Tentang MQH', href: '/tentang' },
      { name: 'Kemitraan (Partnership)', href: '/partnership' },
      { name: 'Hubungi Kami', href: '/kontak' },
    ],
  },
  {
    title: 'Kantor & Bantuan',
    links: [
      { name: 'Pekalongan, Jawa Tengah', href: '/kontak' },
      { name: '+62 858-6896-9000', href: `https://wa.me/${NOMOR_WA}` },
      { name: 'info@mqhtourandtravel.com', href: 'mailto:info@mqhtourandtravel.com' },
      { name: 'Senin – Sabtu, 08.00 – 16.00 WIB', href: '/kontak' },
      { name: 'Konsultasi Gratis WhatsApp', href: `https://wa.me/${NOMOR_WA}?text=Assalamualaikum%20MQH%2C%20saya%20ingin%20konsultasi%20paket` },
    ],
  },
]

const socialLinks = [
  { icon: <InstagramIcon className="size-5" />, href: INSTAGRAM_URL, label: 'Instagram' },
  { icon: <FacebookIcon className="size-5" />, href: 'https://www.facebook.com/p/MQH-Tour-Travel-61551546576358/', label: 'Facebook' },
  { icon: <TiktokIcon className="size-5" />, href: 'https://www.tiktok.com/@mqhtourandtravel', label: 'TikTok' },
  { icon: <YoutubeIcon className="size-5" />, href: 'https://www.youtube.com/@MQHtourandtravel', label: 'YouTube' },
]


const legalLinks = [
  { name: 'Kebijakan Privasi', href: '/tentang' },
  { name: 'Syarat & Ketentuan', href: '/partnership' },
  { name: 'Legalitas Kemenag', href: '/tentang' },
]

export default function SiteFooter() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/agent') || pathname?.startsWith('/jamaah')) return null

  return (
    <footer className="relative bg-[#002A27] text-[#F4FBFA] overflow-hidden" role="contentinfo">
      {/* Top Accent Gradient Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#E6B472] to-transparent opacity-80" />

      {/* Subtle ambient light glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#E6B472]/10 blur-[100px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:items-start lg:text-left">
          {/* Brand Info */}
          <div className="flex w-full flex-col justify-between gap-6 lg:max-w-sm lg:items-start">
            <div className="flex items-center gap-3">
              <Link href="/" aria-label="MQH Tour & Travel">
                <Image
                  src="/logo.png"
                  alt="MQH Tour & Travel"
                  width={493}
                  height={220}
                  className="h-11 w-auto object-contain rounded-md bg-white/5 p-1 border border-white/10"
                />
              </Link>
            </div>

            <p className="text-sm text-[#D8EFEB]/80 leading-relaxed">
              Biro perjalanan Haji Khusus &amp; Umroh resmi Kemenag RI. Berkomitmen menghadirkan bimbingan ibadah sesuai sunnah, kenyamanan fasilitas, dan pelayanan amanah untuk ketenangan hati jamaah.
            </p>

            {/* Legal Badges */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 w-full sm:w-auto">
              <ShieldCheck className="text-[#E6B472] shrink-0 size-6" />
              <div>
                <p className="text-xs font-semibold text-white">Izin Resmi Kemenag RI</p>
                <p className="text-[11px] text-[#D8EFEB]/70">PPIU: {NOMOR_PPIU}{NOMOR_PIHK && <> &bull; PIHK: {NOMOR_PIHK}</>}</p>
              </div>
            </div>

            {/* Social Links */}
            <ul className="flex items-center space-x-5 text-white/70">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-[#E6B472] transition-colors p-1">
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Columns (Footer7 grid layout) */}
          <div className="grid w-full gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 flex-1">
            {mqhSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 text-sm font-bold text-[#E6B472] uppercase tracking-[1.5px]">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm text-[#D8EFEB]/75">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-[#E6B472] block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs font-medium text-[#D8EFEB]/60 md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">
            &copy; {new Date().getFullYear()} MQH Tour &amp; Travel. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <ul className="order-1 flex flex-wrap gap-4 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href} className="hover:text-[#E6B472] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating WhatsApp Quick Contact */}
      <a
        href={`https://wa.me/${NOMOR_WA}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp MQH"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,.4)] hover:scale-110 hover:shadow-[0_6px_24px_rgba(37,211,102,.5)] transition-all duration-300 z-50"
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
      </a>
    </footer>
  )
}
