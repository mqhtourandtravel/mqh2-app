import { getKeberangkatanAktif, getMaskapaiList, getHotelList, getArtikelTerbit, getTestimoniAktif } from '@/lib/queries'
import { getInstagramFeed } from '@/lib/instagram'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, INSTAGRAM_BIO, HERO_IMG } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PaketTable from '@/components/PaketTable'
import PhotoBlock from '@/components/PhotoBlock'
import { waLink } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export default async function Home() {
  const [keberangkatanList, maskapaiList, hotelList, artikelList, testimoniList, instagramPosts] = await Promise.all([
    getKeberangkatanAktif({ limit: 5 }),
    getMaskapaiList(),
    getHotelList(),
    getArtikelTerbit({ limit: 3 }),
    getTestimoniAktif(),
    getInstagramFeed(5),
  ])

  const highlight = keberangkatanList

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* HERO */}
      <header className="relative h-screen min-h-[600px] w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image src={HERO_IMG} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-5 mx-auto flex flex-col items-center">
          <p className="text-secondary text-[12px] font-semibold uppercase tracking-[0.25em] mb-4">
            Terpercaya, Terbukti, Recommended
          </p>
          <h1 className="font-serif text-[44px] md:text-[72px] font-semibold leading-[1.1] md:leading-[1.05] text-primary-foreground mb-6 tracking-tight">
            Perjalanan Spiritual yang Elegan &amp; Nyaman
          </h1>
          <p className="text-[16px] md:text-[18px] text-primary-foreground/85 mb-10 max-w-xl leading-relaxed">
            Hadirkan ketenangan dalam setiap langkah ibadah Anda dengan layanan premium dan pendampingan profesional dari MQH Tour &amp; Travel.
          </p>
          <Button asChild variant="secondary" size="lg" className="hover:shadow-xl hover:scale-105">
            <Link href="/paket">
              Cek Jadwal Keberangkatan
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </Button>
        </div>

        {/* Trust strip */}
        <div className="absolute bottom-0 left-0 w-full z-20 bg-primary/90 backdrop-blur-md border-t border-white/10 text-primary-foreground">
          <div className="max-w-[1280px] mx-auto px-5 md:px-20 py-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 items-center">
            {[
              { icon: 'flight_takeoff', title: 'Keberangkatan Pasti', desc: 'Sesuai jadwal' },
              { icon: 'sell', title: 'Harga Kompetitif', desc: 'Fasilitas terbaik' },
              { icon: 'support_agent', title: 'Pelayanan Responsif', desc: 'Cepat dan ramah' },
              { icon: 'luggage', title: 'Perlengkapan Eksklusif', desc: 'Fasilitas lengkap' },
            ].map((item, i) => (
              <div key={item.title} className={`flex items-center gap-3 px-2 ${i > 0 ? 'md:border-l md:border-white/10 md:pl-4' : ''}`}>
                <span className="material-symbols-outlined text-secondary text-[28px] flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-[13px] font-bold leading-tight">{item.title}</h3>
                  <p className="text-[10.5px] text-primary-foreground/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="py-24 space-y-24">
        {/* PAKET */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-20">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[32px] md:text-[40px] font-medium text-primary mb-4">
              Pilihan Paket Umroh Terbaik
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Temukan paket perjalanan ibadah yang dirancang khusus untuk kenyamanan dan kekhusyukan Anda.
            </p>
          </div>

          <PaketTable data={highlight} />

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground">
              <Link href="/paket">Lihat Semua Paket</Link>
            </Button>
          </div>
        </section>

        {/* PROMO BANNER — Tabungan Umroh */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-20">
          <div className="relative rounded-2xl overflow-hidden">
            <PhotoBlock imageUrl={HERO_IMG} className="h-[280px] w-full" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent flex items-center">
              <div className="px-8 md:px-14 max-w-md">
                <h3 className="font-serif text-[26px] md:text-[32px] font-semibold text-primary-foreground mb-3">
                  Tabungan Umroh MQH
                </h3>
                <p className="text-[13.5px] text-primary-foreground/85 mb-6 leading-relaxed">
                  Wujudkan niat suci ke Tanah Suci dengan program tabungan umroh yang fleksibel dan terencana.
                </p>
                <Button asChild variant="secondary" className="hover:shadow-lg">
                  <Link href="/tabungan-umroh">Mulai Menabung</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PROMO CARD — Rencana Menuju Baitullah */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-20">
          <div className="bg-muted rounded-2xl p-10 md:p-14 text-center">
            <h3 className="font-serif text-[24px] md:text-[28px] font-medium text-primary mb-3">
              Rencana Menuju Baitullah
            </h3>
            <p className="text-[14px] text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
              Susun perjalanan ibadah Anda tanpa terburu-buru. Konsultasikan kebutuhan dan persiapan bersama tim kami.
            </p>
            <Button asChild>
              <a href={waLink('Assalamualaikum, saya ingin konsultasi rencana perjalanan umroh')} target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Mulai Perencanaan
              </a>
            </Button>
          </div>
        </section>

        {/* BERITA */}
        {artikelList && artikelList.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-5 md:px-20">
            <div className="flex justify-between items-end mb-10">
              <h2 className="font-serif text-[26px] md:text-[32px] font-medium text-primary">
                Berita Terkini
              </h2>
              <Link href="/artikel" className="text-[13px] font-semibold text-secondary-hover hover:underline">Lihat Semua</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {artikelList.map((a) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="group">
                  <div className="relative h-[180px] rounded-xl overflow-hidden mb-4">
                    <PhotoBlock imageUrl={a.gambar_url} alt={a.judul} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">
                    {new Date(a.diterbitkan_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {a.kategori && ` · ${a.kategori}`}
                  </p>
                  <h3 className="font-serif text-[16.5px] font-medium text-primary leading-snug group-hover:text-secondary-hover transition">
                    {a.judul}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONI */}
        {testimoniList.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-5 md:px-20">
            <div className="text-center mb-10">
              <h2 className="font-serif text-[26px] md:text-[32px] font-medium text-primary mb-3">
                Apa Kata Jamaah
              </h2>
              <p className="text-[13.5px] text-muted-foreground max-w-xl mx-auto">
                Pengalaman jamaah menjadi bagian dari komitmen kami dalam melayani perjalanan ibadah.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimoniList.map((testimoni) => (
                <figure key={testimoni.id} className="bg-white rounded-xl border border-accent p-6">
                  <blockquote className="text-[14px] leading-relaxed text-primary/90 italic">
                    &ldquo;{testimoni.isi}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-[12.5px] font-semibold text-secondary-hover">
                    {testimoni.nama_sumber}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* INSTAGRAM FEED -- ambil post asli lewat Instagram Graph API kalau
            INSTAGRAM_ACCESS_TOKEN & INSTAGRAM_USER_ID sudah diisi di env
            (lihat lib/instagram.ts & CARA_PASANG.md). Kalau belum, tampilkan
            kartu profil asli (bio & follow) -- bukan grid placeholder palsu. */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary shrink-0 bg-muted flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary-hover text-[22px]">photo_camera</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-primary flex items-center gap-1">
                {INSTAGRAM_HANDLE}
                <span className="material-symbols-outlined text-[15px] text-blue-500">verified</span>
              </h3>
              <p className="text-[12.5px] text-muted-foreground">{INSTAGRAM_BIO}</p>
            </div>
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
                    className={`aspect-square relative rounded-xl overflow-hidden group block ${i === 4 ? 'hidden md:block' : ''}`}
                  >
                    <Image
                      src={post.mediaUrl}
                      alt={post.caption?.slice(0, 80) || 'Post Instagram MQH'}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </a>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Button asChild variant="secondary">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Follow di Instagram
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[13.5px] text-muted-foreground max-w-md leading-relaxed">
                Lihat aktivitas keberangkatan, dokumentasi jamaah, dan info terbaru langsung dari akun Instagram resmi kami.
              </p>
              <Button asChild variant="secondary" className="shrink-0">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  Kunjungi @{INSTAGRAM_HANDLE}
                </a>
              </Button>
            </div>
          )}
        </section>

        {/* PARTNER */}
        {((maskapaiList?.length ?? 0) > 0 || (hotelList?.length ?? 0) > 0) && (
          <section className="max-w-[1280px] mx-auto px-5 md:px-20 text-center">
            <h2 className="font-serif text-[22px] font-medium text-primary mb-1">
              Didukung Maskapai &amp; Hotel Terbaik
            </h2>
            <p className="text-[13px] text-muted-foreground mb-10">Kerjasama resmi dengan maskapai ternama dan hotel berstandar internasional</p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
              {maskapaiList.map((m) => (
                <span key={m.id} className="text-[14px] font-semibold text-muted-foreground">{m.nama}</span>
              ))}
              {hotelList.map((h) => (
                <span key={h.id} className="text-[14px] font-medium text-muted-foreground">{h.nama}</span>
              ))}
            </div>
          </section>
        )}

        {/* APP PROMO (belum ada app asli -- ditandai "Segera Hadir") */}
        <section className="glass-panel border-y border-accent py-20 relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-5 md:px-20">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-[280px]">
                  <div className="aspect-[9/19] bg-white/50 backdrop-blur-2xl rounded-[2.5rem] border-[8px] border-primary shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                      <div className="w-28 h-6 bg-primary rounded-b-xl" />
                    </div>
                    <div className="bg-primary/90 text-primary-foreground pt-9 pb-4 px-5 z-10">
                      <p className="text-[10px] opacity-70 mb-0.5">Selamat datang,</p>
                      <p className="font-bold text-[13px]">Jamaah MQH</p>
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div className="h-20 bg-white/50 rounded-xl border border-white/60 flex items-center justify-center">
                        <span className="text-primary text-[11px] font-medium">Jadwal Ibadah Hari Ini</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 bg-accent/60 rounded-xl border border-white/50" />
                        <div className="h-16 bg-info/50 rounded-xl border border-white/50" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-4 bg-secondary/25 blur-3xl rounded-full -z-10" />
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left">
                <p className="text-[13px] font-semibold text-primary mb-2">Dalam Genggaman Anda</p>
                <h2 className="font-serif text-[30px] md:text-[36px] font-semibold text-secondary-hover mb-5">MQH Mobile</h2>
                <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                  Nikmati kemudahan persiapan dan pelaksanaan ibadah melalui satu aplikasi terpadu. Akses jadwal perjalanan, panduan manasik, hingga doa-doa penting dengan mudah.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {['Google Play', 'App Store'].map((store) => (
                    <div key={store} aria-disabled="true" className="bg-primary/90 text-primary-foreground px-5 py-3 rounded-xl flex items-center gap-3 border border-white/10 relative cursor-not-allowed opacity-90">
                      <span className="material-symbols-outlined text-2xl">{store === 'Google Play' ? 'shop' : 'apple'}</span>
                      <div className="text-left">
                        <p className="text-[9px] uppercase tracking-wider opacity-70">Segera Hadir di</p>
                        <p className="font-bold text-[13px] leading-tight">{store}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
