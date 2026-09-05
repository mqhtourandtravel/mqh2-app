'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa'
import { ShieldCheck, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { NOMOR_PPIU, NOMOR_PIHK, NOMOR_WA, INSTAGRAM_URL } from '@/lib/config'

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
  { icon: <FaInstagram className="size-5" />, href: INSTAGRAM_URL, label: 'Instagram' },
  { icon: <FaFacebook className="size-5" />, href: 'https://facebook.com', label: 'Facebook' },
  { icon: <FaTiktok className="size-5" />, href: 'https://tiktok.com', label: 'TikTok' },
  { icon: <FaYoutube className="size-5" />, href: 'https://youtube.com', label: 'YouTube' },
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
                <p className="text-[11px] text-[#D8EFEB]/70">PPIU: {NOMOR_PPIU} &bull; PIHK: {NOMOR_PIHK}</p>
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
