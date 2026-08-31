import { getKeberangkatanAktif, getMaskapaiList, getHotelList, getArtikelTerbit } from '@/lib/queries'
import { TESTIMONI_LIST } from '@/lib/config'
import { getInstagramFeed } from '@/lib/instagram'
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

export const revalidate = 60

const KEUNGGULAN = [
  {
    icon: ShieldCheck,
    title: 'Resmi & Berizin',
    desc: 'Terdaftar resmi di Kementerian Agama dengan jaminan legalitas penuh.',
  },
  {
    icon: UserCheck,
    title: 'Pembimbing Berpengalaman',
    desc: 'Muthawwif bersertifikat dan asatidz yang membimbing sesuai sunnah.',
  },
  {
    icon: Hotel,
    title: 'Hotel Dekat Pelataran',
    desc: 'Akomodasi bintang 4-5 di ring 1 Masjidil Haram dan Masjid Nabawi.',
  },
  {
    icon: CalendarCheck,
    title: 'Pasti Berangkat',
    desc: 'Jadwal, visa, tiket pesawat, dan hotel telah terkonfirmasi sejak awal.',
  },
]

export default async function Home() {
  const [keberangkatanList, maskapaiList, hotelList, artikelList, instagramPosts] = await Promise.all([
    getKeberangkatanAktif({ limit: 5 }),
    getMaskapaiList(),
    getHotelList(),
    getArtikelTerbit({ limit: 3 }),
    getInstagramFeed(5),
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
      >
        <div className="flex justify-center pb-2">
          <Button asChild variant="outline" size="sm" className="backdrop-blur-sm bg-white/80 border-primary/20 text-primary hover:bg-white">
            <a href="#paket">
              Lihat Paket Umroh
              <ArrowRight className="size-4 rotate-90" />
            </a>
          </Button>
        </div>
      </ScrollExpandMedia>

      <main>
        {/* KEUNGGULAN — Value Proposition */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 pt-[48px] md:pt-[72px] pb-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {KEUNGGULAN.map((k) => (
              <div key={k.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <k.icon className="size-6 text-secondary-hover" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-[1.05rem] font-semibold text-foreground mb-1.5">{k.title}</h3>
                  <p className="text-[0.85rem] text-muted-foreground leading-[1.6]">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAKET */}
        <section id="paket" className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
          <div className="text-center mb-12">
            <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Paket Kami</p>
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

        {/* TESTIMONI */}
        {TESTIMONI_LIST.length > 0 && (
          <section className="bg-primary-dark">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px] md:py-[100px]">
              <div className="text-center mb-12">
                <p className="text-[0.85rem] font-semibold text-secondary uppercase tracking-[3px] mb-3">Testimoni</p>
                <h2 className="font-serif text-[2.125rem] md:text-[3rem] font-bold text-white mb-4 leading-[1.167]">
                  Apa Kata Jamaah
                </h2>
                <div className="gold-divider mx-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {TESTIMONI_LIST.map((testimoni) => (
                  <div key={testimoni.namaSumber} className="bg-white/5 backdrop-blur-sm rounded-[16px] border border-white/10 p-8">
                    <div className="text-secondary text-[2rem] font-serif mb-4">&ldquo;</div>
                    <blockquote className="text-[1rem] leading-[1.8] text-white/80 italic mb-6">
                      {testimoni.isi}
                    </blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <span className="text-secondary font-semibold text-[0.85rem]">{testimoni.namaSumber.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[0.95rem] font-semibold text-white">{testimoni.namaSumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
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

          {instagramPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {instagramPosts.map((post, i) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`aspect-square relative rounded-[16px] overflow-hidden group block ${i === 4 ? 'hidden md:block' : ''}`}
                  >
                    <Image
                      src={post.mediaUrl}
                      alt={post.caption?.slice(0, 80) || 'Post Instagram MQH'}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-[1.08] transition-transform duration-[600ms]"
                    />
                  </a>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Button asChild>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Camera className="size-4" />
                    Follow di Instagram
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-[16px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[1.1rem] text-muted-foreground max-w-md leading-[1.7]">
                Lihat aktivitas keberangkatan, dokumentasi jamaah, dan info terbaru langsung dari akun Instagram resmi kami.
              </p>
              <Button asChild className="shrink-0">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Camera className="size-4" />
                  Kunjungi @{INSTAGRAM_HANDLE}
                </a>
              </Button>
            </div>
          )}
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
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
                {maskapaiList.map((m) => (
                  <span key={m.id} className="text-[1rem] font-serif font-semibold tracking-wide text-primary/50 hover:text-primary transition-colors duration-300">{m.nama}</span>
                ))}
                <span className="hidden md:inline w-px h-6 bg-border" aria-hidden="true" />
                {hotelList.map((h) => (
                  <span key={h.id} className="text-[1rem] font-serif font-medium tracking-wide text-primary/40 hover:text-primary transition-colors duration-300">{h.nama}</span>
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