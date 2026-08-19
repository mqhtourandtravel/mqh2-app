import Link from 'next/link'
import { NOMOR_PPIU, NOMOR_PIHK, NOMOR_WA } from '@/lib/config'
import { Separator } from '@/components/ui/separator'

export default function SiteFooter() {
  return (
    <>
      <footer className="bg-primary text-primary-foreground/80 pt-20 pb-8 px-5 md:px-20">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-10 pb-14">
          <div className="md:col-span-2">
            <p className="font-serif text-xl font-bold text-primary-foreground mb-4">
              MQH<span className="text-secondary">·</span>Tour
            </p>
            <p className="text-[13.5px] leading-relaxed max-w-[320px] mb-5 text-primary-foreground/90">
              Travel umroh &amp; haji terpercaya dengan layanan profesional, fasilitas premium, dan keberangkatan pasti untuk perjalanan ibadah yang nyaman dan tenang.
            </p>
            <p className="text-[11.5px] text-secondary leading-loose">
              Izin Umrah (PPIU) No. {NOMOR_PPIU}
              {NOMOR_PIHK && <><br />Izin Haji (PIHK) No. {NOMOR_PIHK}</>}
            </p>
          </div>
          <div>
            <h4 className="text-primary-foreground text-[12px] font-bold uppercase tracking-wide mb-4">Main Menu</h4>
            <ul className="space-y-3 text-[13.5px]">
              <li><Link href="/paket" className="hover:text-secondary transition">Paket</Link></li>
              <li><Link href="/cabang" className="hover:text-secondary transition">Cabang</Link></li>
              <li><Link href="/artikel" className="hover:text-secondary transition">Artikel</Link></li>
              <li><Link href="/tentang" className="hover:text-secondary transition">About</Link></li>
              <li><Link href="/partnership" className="hover:text-secondary transition">Partnership</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-primary-foreground text-[12px] font-bold uppercase tracking-wide mb-4">Contact Us</h4>
            <ul className="space-y-3 text-[13.5px]">
              <li>Pekalongan, Jawa Tengah</li>
              <li><a href={`https://wa.me/${NOMOR_WA}`} className="hover:text-secondary transition">+62 858-6896-9000</a></li>
            </ul>
          </div>
        </div>
        <Separator className="max-w-[1280px] mx-auto bg-primary-foreground/10" />
        <div className="max-w-[1280px] mx-auto pt-6 text-[12px] text-primary-foreground/60 text-center">
          © {new Date().getFullYear()} MQH Tour &amp; Travel. Crafted for your spiritual journey.
        </div>
      </footer>

      <a href={`https://wa.me/${NOMOR_WA}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-[0_8px_24px_rgba(230,190,138,0.5)] hover:scale-105 transition z-50">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-primary">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.83 14.13c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.38.24-.26.53-.32.71-.32h.5c.16 0 .38-.01.59.46.24.53.79 1.85.86 1.98.07.13.12.29.02.47-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.7 1.16 1.51 1.88 1.04.93 1.91 1.22 2.19 1.36.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.13.44.19.51.3.07.11.07.6-.17 1.28z"/>
        </svg>
      </a>
    </>
  )
}
