import { getKeberangkatanAktif, getMaskapaiList, getHotelList, getArtikelTerbit } from '@/lib/queries'
import { TESTIMONI_LIST } from '@/lib/config'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, INSTAGRAM_BIO, HERO_IMG, HERO_VIDEO } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '@/components/SiteHeader'
import PaketTable from '@/components/PaketTable'
import PhotoBlock from '@/components/PhotoBlock'
import { waLink, formatTanggal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Camera, MessageCircle, ArrowRight, ShieldCheck, UserCheck, Hotel, CalendarCheck } from 'lucide-react'

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1'
import InstagramEmbed from '@/components/InstagramEmbed'

export const revalidate = 60

const MITRA_LOGOS = [
  { nama: 'Saudi Airlines', src: '/images/logos/saudia.svg', w: 100, h: 36 },
  { nama: 'Garuda Indonesia', src: '/images/logos/garuda-indonesia.svg', w: 140, h: 32 },
  { nama: 'Etihad Airways', src: '/images/logos/etihad.svg', w: 110, h: 32 },
  { nama: 'Swissôtel Makkah', src: '/images/logos/swissotel.svg', w: 120, h: 32 },
  { nama: 'Pullman Zamzam', src: '/images/logos/pullman.svg', w: 110, h: 32 },
  { nama: 'Mövenpick Hotels', src: '/images/logos/movenpick.svg', w: 130, h: 36 },
  { nama: 'Hilton Hotels', src: '/images/logos/hilton.png', w: 100, h: 36 },
]

export default async function Home() {
  const [keberangkatanList, maskapaiList, hotelList, artikelList] = await Promise.all([
    getKeberangkatanAktif({ limit: 5 }),
    getMaskapaiList(),
    getHotelList(),
    getArtikelTerbit({ limit: 3 }),
  ])

  const highlight = keberangkatanList

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* HERO — Scroll Expansion: 1 Gambar Latar + 1 Video Mekkah */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={HERO_VIDEO}
        bgImageSrc={HERO_IMG}
        posterSrc={HERO_IMG}
        title="Perjalanan Spiritual yang Elegan & Nyaman"
        date="MQH Tour & Travel"
        textBlend
        logo={{ src: '/logo.png', alt: 'MQH Tour & Travel', width: 148, height: 66 }}
        brandName="MQH Tour & Travel"
        ctaNode={
          <Button asChild size="sm" className="bg-black/20 text-white border-0 hover:bg-black/30 transition-colors rounded-full px-4 md:px-6 py-2 md:py-3">
            <a href="#paket">
              Lihat Paket Umroh
              <ArrowRight className="size-4 rotate-90" />
            </a>
          </Button>
        }
        pillarsNode={
          <div className="bg-black/40 rounded-xl border border-white/10 shadow-md w-full flex flex-wrap justify-center gap-[clamp(0.75rem,2vw,2rem)] px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.75rem,2.5vh,1.5rem)]">
            <div className="flex items-center gap-[clamp(0.4rem,1vw,0.75rem)] flex-1 basis-0 min-w-[130px] max-w-[260px] text-white">
              <ShieldCheck className="w-[clamp(1.5rem,1.8vw,2.25rem)] h-[clamp(1.5rem,1.8vw,2.25rem)] shrink-0" />
              <div>
                <div className="font-semibold text-[clamp(0.875rem,1.3vw,1.25rem)] leading-[1.2]">Resmi & Berizin</div>
                <div className="text-[clamp(0.75rem,1vw,1rem)] text-white/70 leading-[1.2]">Legalitas resmi Kemenag</div>
              </div>
            </div>
            <div className="flex items-center gap-[clamp(0.4rem,1vw,0.75rem)] flex-1 basis-0 min-w-[130px] max-w-[260px] text-white">
              <UserCheck className="w-[clamp(1.5rem,1.8vw,2.25rem)] h-[clamp(1.5rem,1.8vw,2.25rem)] shrink-0" />
              <div>
                <div className="font-semibold text-[clamp(0.875rem,1.3vw,1.25rem)] leading-[1.2]">Tim Professional</div>
                <div className="text-[clamp(0.75rem,1vw,1rem)] text-white/70 leading-[1.2]">Muthawwif bersertifikat</div>
              </div>
            </div>
            <div className="flex items-center gap-[clamp(0.4rem,1vw,0.75rem)] flex-1 basis-0 min-w-[130px] max-w-[260px] text-white">
              <Hotel className="w-[clamp(1.5rem,1.8vw,2.25rem)] h-[clamp(1.5rem,1.8vw,2.25rem)] shrink-0" />
              <div>
                <div className="font-semibold text-[clamp(0.875rem,1.3vw,1.25rem)] leading-[1.2]">Hotel Dekat</div>
                <div className="text-[clamp(0.75rem,1vw,1rem)] text-white/70 leading-[1.2]">Ring 1-2 Haramain</div>
              </div>
            </div>
            <div className="flex items-center gap-[clamp(0.4rem,1vw,0.75rem)] flex-1 basis-0 min-w-[130px] max-w-[260px] text-white">
              <CalendarCheck className="w-[clamp(1.5rem,1.8vw,2.25rem)] h-[clamp(1.5rem,1.8vw,2.25rem)] shrink-0" />
              <div>
                <div className="font-semibold text-[clamp(0.875rem,1.3vw,1.25rem)] leading-[1.2]">Pasti Berangkat</div>
                <div className="text-[clamp(0.75rem,1vw,1rem)] text-white/70 leading-[1.2]">Jadwal Terkonfirmasi</div>
              </div>
            </div>
          </div>
        }
      />

      <main>


        {/* PAKET */}
        <section id="paket" className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-foreground mb-4 leading-[1.167]">
              Pilihan Paket Umroh Terbaik
            </h2>
            <div className="gold-divider mx-auto mb-5" />
            <p className="text-[1.1rem] text-muted-foreground max-w-xl mx-auto leading-[1.7]">
              Temukan paket perjalanan ibadah yang dirancang khusus untuk kenyamanan dan kekhusyukan Anda.
            </p>
          </div>

          <PaketTable data={highlight} />

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/paket">Lihat Semua Paket</Link>
            </Button>
          </div>
        </section>

        {/* PROMO BANNER — Tabungan Umroh */}
        <section className="bg-background-cream">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-[40px] md:py-[60px]">
            <div className="relative rounded-[16px] overflow-hidden">
              <PhotoBlock imageUrl="/images/savings-growth.jpg" className="h-[300px] md:h-[380px] w-full" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-darker/90 via-primary-dark/70 to-transparent flex items-center">
                <div className="px-8 md:px-14 max-w-lg">
                  <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Tabungan Umroh</p>
                  <h3 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-white mb-4 leading-[1.167]">
                    Wujudkan Niat Suci Anda
                  </h3>
                  <p className="text-[1.1rem] text-white/80 mb-8 leading-[1.7]">
                    Program tabungan umroh yang fleksibel dan terencana untuk perjalanan ibadah Anda.
                  </p>
                  <Button asChild>
                    <Link href="/tabungan-umroh">
                      Mulai Menabung
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROMO CARD — Rencana Menuju Baitullah */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 py-[40px] md:py-[60px]">
          <div className="bg-primary-dark rounded-[16px] p-8 md:p-12 text-center">
            <h3 className="font-serif text-[1.875rem] md:text-[2.125rem] font-bold text-white mb-4 leading-[1.2]">
              Rencana Menuju Baitullah
            </h3>
            <p className="text-[1.1rem] text-white/70 max-w-lg mx-auto mb-8 leading-[1.7]">
              Susun perjalanan ibadah Anda tanpa terburu-buru. Konsultasikan kebutuhan dan persiapan bersama tim kami.
            </p>
            <Button asChild>
              <a href={waLink('Assalamualaikum, saya ingin konsultasi rencana perjalanan umroh')} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Mulai Perencanaan
              </a>
            </Button>
          </div>
        </section>

        {/* BERITA */}
        {artikelList && artikelList.length > 0 && (
          <section className="bg-background-cream">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
              <div className="text-center mb-12">
                <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Artikel</p>
                <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-foreground mb-4 leading-[1.167]">
                  Berita Terkini
                </h2>
                <div className="gold-divider mx-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {artikelList.map((a) => (
                  <Link key={a.id} href={`/artikel/${a.slug}`} className="group">
                    <div className="relative h-[220px] rounded-[16px] overflow-hidden mb-5">
                      <PhotoBlock imageUrl={a.gambar_url} alt={a.judul} className="w-full h-full group-hover:scale-[1.08] transition-transform duration-[600ms] cubic-bezier(0.4,0,0.2,1)" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {a.kategori && (
                        <span className="text-[0.75rem] font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">{a.kategori}</span>
                      )}
                      <span className="text-[0.75rem] text-muted-foreground">{formatTanggal(a.diterbitkan_pada)}</span>
                    </div>
                    <h3 className="font-serif text-[1.1rem] font-semibold text-foreground leading-snug group-hover:text-secondary transition-colors duration-300">
                      {a.judul}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONI — Kolom animasi vertikal (marquee) */}
        {TESTIMONI_LIST.length > 0 && (
          <section className="bg-background-cream overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
              <div className="text-center mb-12">
                <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Testimoni</p>
                <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-foreground mb-4 leading-[1.167]">
                  Apa Kata Jamaah
                </h2>
                <div className="gold-divider mx-auto" />
              </div>
              <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[640px] overflow-hidden">
                <TestimonialsColumn
                  testimonials={TESTIMONI_LIST.map((t) => ({
                    text: t.isi,
                    name: t.namaSumber,
                    role: 'Jamaah MQH Tour & Travel',
                  }))}
                  duration={24}
                />
                <TestimonialsColumn
                  className="hidden md:block"
                  testimonials={[...TESTIMONI_LIST].reverse().map((t) => ({
                    text: t.isi,
                    name: t.namaSumber,
                    role: 'Jamaah MQH Tour & Travel',
                  }))}
                  duration={28}
                />
                <TestimonialsColumn
                  className="hidden lg:block"
                  testimonials={TESTIMONI_LIST.map((t, i) => ({
                    text: t.isi,
                    name: t.namaSumber,
                    role: i % 2 === 0 ? 'Jamaah Terdaftar' : 'Jamaah MQH Tour & Travel',
                  }))}
                  duration={22}
                />
              </div>
            </div>
          </section>
        )}

        {/* INSTAGRAM FEED */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
          <div className="text-center mb-12">
            <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Instagram</p>
            <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-foreground mb-4 leading-[1.167]">
              Ikuti Kami
            </h2>
            <div className="gold-divider mx-auto mb-5" />
            <p className="text-[1.1rem] text-muted-foreground max-w-xl mx-auto leading-[1.7]">
              {INSTAGRAM_BIO}
            </p>
          </div>

          {/* Embed Behold.so — feed IG resmi tanpa API key di server */}
          <div className="mx-auto max-w-3xl rounded-[16px] overflow-hidden">
            <InstagramEmbed feedId="783O3bePOilREjhAMorv" />
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Camera className="size-4" />
                Follow di Instagram
              </a>
            </Button>
          </div>
        </section>

        {/* PARTNER */}
        {((maskapaiList?.length ?? 0) > 0 || (hotelList?.length ?? 0) > 0) && (
          <section className="bg-background-cream">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-[40px] md:py-[60px] text-center">
              <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Mitra Kami</p>
              <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-foreground mb-4 leading-[1.167]">
                Didukung Maskapai &amp; Hotel Terbaik
              </h2>
              <div className="gold-divider mx-auto mb-5" />
              <p className="text-[1.1rem] text-muted-foreground mb-12 leading-[1.7]">Kerjasama resmi dengan maskapai ternama dan hotel berstandar internasional</p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                {MITRA_LOGOS.map((m) => (
                  <Image
                    key={m.nama}
                    src={m.src}
                    alt={m.nama}
                    width={m.w}
                    height={m.h}
                    className="h-8 md:h-9 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* APP PROMO */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-[280px]">
                <div className="aspect-[9/19] bg-white rounded-[2.5rem] border-[8px] border-foreground/10 shadow-[var(--shadow-xl)] relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                    <div className="w-28 h-6 bg-foreground/10 rounded-b-xl" />
                  </div>
                  <div className="bg-primary text-white pt-9 pb-4 px-5 z-10">
                    <p className="text-[0.65rem] opacity-70 mb-0.5">Selamat datang,</p>
                    <p className="font-semibold text-[0.85rem]">Jamaah MQH</p>
                  </div>
                  <div className="flex-1 p-5 space-y-3 bg-background">
                    <div className="h-20 bg-muted rounded-[16px] border border-border flex items-center justify-center">
                      <span className="text-muted-foreground text-[0.75rem] font-medium">Jadwal Ibadah Hari Ini</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-accent rounded-[16px] border border-border" />
                      <div className="h-16 bg-muted rounded-[16px] border border-border" />
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-secondary/10 blur-3xl rounded-full -z-10" />
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Mobile App</p>
              <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-foreground mb-5 leading-[1.167]">MQH Mobile</h2>
              <p className="text-[1.1rem] text-muted-foreground leading-[1.7] mb-8 max-w-md mx-auto md:mx-0">
                Nikmati kemudahan persiapan dan pelaksanaan ibadah melalui satu aplikasi terpadu. Akses jadwal perjalanan, panduan manasik, hingga doa-doa penting dengan mudah.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <div className="bg-foreground text-white px-5 py-3 rounded-lg flex items-center gap-3 opacity-90 cursor-not-allowed">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  <div className="text-left">
                    <p className="text-[0.6rem] uppercase tracking-[0.04em] opacity-70">Segera Hadir di</p>
                    <p className="font-semibold text-[0.85rem] leading-tight">Google Play</p>
                  </div>
                </div>
                <div className="bg-foreground text-white px-5 py-3 rounded-lg flex items-center gap-3 opacity-90 cursor-not-allowed">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,16.56 2.93,11.3 4.7,7.72C5.57,5.94 7.36,4.86 9.28,4.84C10.56,4.81 11.78,5.72 12.57,5.72C13.36,5.72 14.85,4.62 16.4,4.8C17.06,4.83 18.71,5.06 19.83,6.52C19.73,6.58 17.7,7.81 17.73,10.26C17.76,13.19 20.33,14.18 20.37,14.19C20.33,14.28 19.94,15.64 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/></svg>
                  <div className="text-left">
                    <p className="text-[0.6rem] uppercase tracking-[0.04em] opacity-70">Segera Hadir di</p>
                    <p className="font-semibold text-[0.85rem] leading-tight">App Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}