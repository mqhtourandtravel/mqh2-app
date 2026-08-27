import { getKeberangkatanAktif, getMaskapaiList, getHotelList, getArtikelTerbit } from '@/lib/queries'
import { TESTIMONI_LIST } from '@/lib/config'
import { getInstagramFeed } from '@/lib/instagram'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, INSTAGRAM_BIO, HERO_IMG } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '@/components/SiteHeader'
import PhotoBlock from '@/components/PhotoBlock'
import { waLink, formatTanggal, formatRupiah } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Camera,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Plane,
  Building2,
  Calendar,
  CheckCircle2,
  Star,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'

export const revalidate = 60

const KEUNGGULAN = [
  {
    icon: ShieldCheck,
    title: 'Bimbingan Sesuai Sunnah',
    desc: 'Dibimbing langsung oleh Muthawwif dan Ustadz asatidz berpengalaman lulusan Timur Tengah yang amanah.',
    color: 'from-emerald-500/10 to-amber-500/5',
    iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    icon: Building2,
    title: 'Hotel Bintang 5 Dekat Masjid',
    desc: 'Akomodasi premium berada di pelataran Masjidil Haram dan Nabawi, memudahkan ibadah bagi lansia & keluarga.',
    color: 'from-amber-500/10 to-emerald-500/5',
    iconColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    icon: Plane,
    title: 'Penerbangan Direct Tanpa Transit',
    desc: 'Bekerjasama dengan Saudi Airlines dan Garuda Indonesia untuk perjalanan udara yang cepat, aman, dan nyaman.',
    color: 'from-blue-500/10 to-emerald-500/5',
    iconColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    icon: Award,
    title: 'Kepastian Keberangkatan',
    desc: 'Izin PPIU resmi Kemenag RI, akreditasi A, serta tiket & visa terkonfirmasi sebelum keberangkatan.',
    color: 'from-purple-500/10 to-amber-500/5',
    iconColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
]

const LANGKAH_IBADAH = [
  {
    step: '01',
    title: 'Pilih Paket & Jadwal',
    desc: 'Pilih tanggal keberangkatan dan jenis paket (Reguler, VIP, atau Privat) yang sesuai kebutuhan Anda.',
  },
  {
    step: '02',
    title: 'Konsultasi & Pendaftaran',
    desc: 'Hubungi konsultan kami untuk verifikasi kuota, booking seat, dan kemudahan pengurusan paspor & dokumen.',
  },
  {
    step: '03',
    title: 'Manasik Intensif',
    desc: 'Ikuti pelatihan manasik komprehensif teori dan praktek sebelum hari keberangkatan menuju tanah suci.',
  },
  {
    step: '04',
    title: 'Ibadah Khusyuk di Tanah Suci',
    desc: 'Menjalankan rangkaian ibadah umroh dan ziarah dengan pendampingan penuh hingga kembali ke tanah air.',
  },
]

export default async function Home() {
  const [keberangkatanList, maskapaiList, hotelList, artikelList, instagramPosts] = await Promise.all([
    getKeberangkatanAktif({ limit: 6 }),
    getMaskapaiList(),
    getHotelList(),
    getArtikelTerbit({ limit: 3 }),
    getInstagramFeed(5),
  ])

  return (
    <div className="bg-[#fcfbf9] text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* HERO SECTION with Expansion */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={HERO_IMG}
        bgImageSrc={HERO_IMG}
        title="Perjalanan Spiritual yang Elegan & Nyaman"
        date="MQH Tour & Travel — Izin Resmi Kemenag RI"
        textBlend
      />

      {/* 1. TRUST & CREDENTIALS FLOATING BAR */}
      <section className="relative z-20 -mt-8 md:-mt-12 max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-amber-200/60 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0">
            <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
              <ShieldCheck className="size-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Resmi Kemenag</p>
              <p className="text-xs font-semibold text-gray-900 leading-tight">PPIU No. U.404 / 2020</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="size-11 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Award className="size-6 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Akreditasi A</p>
              <p className="text-xs font-semibold text-gray-900 leading-tight">Kualitas Layanan Terbaik</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="size-11 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-800 shrink-0 shadow-xs">
              <Plane className="size-6 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Direct Flight</p>
              <p className="text-xs font-semibold text-gray-900 leading-tight">Tanpa Transit Berlama</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
            <div className="size-11 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-800 shrink-0 shadow-xs">
              <Building2 className="size-6 text-purple-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Hotel Bintang 5</p>
              <p className="text-xs font-semibold text-gray-900 leading-tight">Pelataran Masjidil Haram</p>
            </div>
          </div>
        </div>
      </section>

      <main className="space-y-20 md:space-y-32 py-16 md:py-24">
        {/* 2. PILIHAN PAKET UMROH & HAJI */}
        <section className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5 text-amber-600" /> Paket Pilihan Eksklusif
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c2417] tracking-tight">
              Pilihan Paket Umroh &amp; Haji Terbaik
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Dirancang dengan standar kenyamanan tinggi, akomodasi berkelas, dan pendampingan ibadah yang khusyuk.
            </p>
          </div>

          {/* Package Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {keberangkatanList.map((k) => {
              const hargaFinal = k.harga_promo ?? k.harga_normal
              const cicilanEstimasi = Math.round(Number(hargaFinal) / 24)
              const paketData = k.paket

              return (
                <div
                  key={k.id}
                  className="group bg-white rounded-2xl border border-gray-200/90 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image Header */}
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                      <PhotoBlock
                        imageUrl={paketData?.gambar_url}
                        alt={paketData?.nama_paket ?? 'Paket MQH'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-800 text-white shadow-md">
                          {paketData?.kategori ?? 'Umroh'}
                        </span>
                        {paketData?.tier && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-[#0c2417] shadow-md">
                            {paketData.tier}
                          </span>
                        )}
                      </div>

                      {/* Duration Badge */}
                      {k.durasi_hari && (
                        <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
                          {k.durasi_hari} Hari
                        </div>
                      )}

                      {/* Title on bottom of photo */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <h3 className="font-serif text-lg md:text-xl font-bold leading-snug drop-shadow-sm group-hover:text-amber-300 transition-colors">
                          {paketData?.nama_paket}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content & Features */}
                    <div className="p-5 space-y-4">
                      {/* Keberangkatan & Seat info */}
                      <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                        <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                          <Calendar className="size-3.5 text-emerald-700" />
                          <span>{formatTanggal(k.tanggal_berangkat)}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          k.status === 'penuh'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : k.status === 'terbatas'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {k.status === 'penuh' ? 'Waiting List' : k.status === 'terbatas' ? `Sisa ${k.kuota_tersisa} Seat` : 'Seat Tersedia'}
                        </span>
                      </div>

                      {/* Maskapai & Hotel Pills */}
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Plane className="size-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate font-medium">{k.maskapai?.nama ?? 'Saudi Airlines / Garuda'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="truncate space-x-1.5 font-medium">
                            <span>Mekkah: {k.hotel_mekkah?.nama ?? 'Bintang 5'}</span>
                            <span>•</span>
                            <span>Madinah: {k.hotel_madinah?.nama ?? 'Bintang 5'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="p-5 pt-0 mt-2 border-t border-gray-100/80">
                    <div className="pt-4 flex items-end justify-between mb-4">
                      <div>
                        {k.harga_promo && (
                          <p className="text-[11px] text-gray-400 line-through">
                            {formatRupiah(k.harga_normal)}
                          </p>
                        )}
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mulai Dari</p>
                        <p className="font-serif text-xl md:text-2xl font-bold text-amber-700 leading-tight">
                          {formatRupiah(hargaFinal)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">Cicilan Tabungan</p>
                        <p className="text-xs font-semibold text-emerald-800">
                          {formatRupiah(cicilanEstimasi)}<span className="text-[10px] font-normal text-gray-500">/bln</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="h-9 text-xs border-gray-300 hover:bg-gray-50 font-semibold rounded-lg">
                        <Link href={`/paket/${paketData?.slug}?jadwal=${k.id}`}>
                          Lihat Detail
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="h-9 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm gap-1">
                        <a
                          href={waLink(`Assalamualaikum, saya ingin konsultasi paket ${paketData?.nama_paket ?? 'Umroh'} keberangkatan ${formatTanggal(k.tanggal_berangkat)}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="size-3.5" /> Konsultasi
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-[#0c2417] hover:bg-[#163926] text-white px-8 rounded-xl font-semibold shadow-md gap-2">
              <Link href="/paket">
                Lihat Seluruh Katalog Paket <ArrowRight className="size-4 text-amber-400" />
              </Link>
            </Button>
          </div>
        </section>

        {/* 3. MENGAPA MEMILIH MQH (THE MQH DIFFERENCE) */}
        <section className="bg-gradient-to-b from-white via-emerald-50/20 to-white py-16 md:py-24 border-y border-emerald-100/60">
          <div className="max-w-[1240px] mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Keunggulan Kami
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c2417] tracking-tight">
                Mengapa Memilih MQH Tour &amp; Travel?
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Komitmen kami adalah menghadirkan ibadah yang tenang, teratur, dan berkesan seumur hidup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KEUNGGULAN.map((k) => {
                const Icon = k.icon
                return (
                  <div
                    key={k.title}
                    className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 hover:-translate-y-1"
                  >
                    <div className={`size-13 rounded-xl border flex items-center justify-center ${k.iconColor} shadow-inner`}>
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                      {k.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {k.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 4. LANGKAH MUDAH MENUJU BAITULLAH (JOURNEY TIMELINE) */}
        <section className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="size-3.5 text-amber-600" /> Tahapan Ibadah
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c2417] tracking-tight">
              4 Langkah Mudah Menuju Tanah Suci
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Proses pendaftaran yang transparan, terstruktur, dan didampingi konsultan ibadah profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {LANGKAH_IBADAH.map((l) => (
              <div key={l.step} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs relative space-y-3">
                <span className="font-serif text-4xl font-extrabold text-amber-500/25 block">
                  {l.step}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0c2417] leading-snug">
                  {l.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {l.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TABUNGAN UMROH BANNER PROMO */}
        <section className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c2417] via-[#123623] to-[#1a4a31] text-white p-8 md:p-14 shadow-2xl border border-emerald-800/40">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                  <Sparkles className="size-3 text-amber-400" /> Solusi Tabungan Syariah
                </div>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Wujudkan Niat Suci Menuju Baitullah
                </h3>
                <p className="text-sm md:text-base text-emerald-100/80 leading-relaxed max-w-lg">
                  Program perencanaan tabungan umroh tanpa riba, fleksibel, dan terencana. Mulai langkah ibadah Anda bersama keluarga hari ini.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-[#0c2417] font-bold shadow-lg rounded-xl h-11 px-6">
                    <Link href="/tabungan-umroh">
                      Mulai Menabung Sekarang <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 font-semibold rounded-xl h-11 px-6">
                    <a href={waLink('Assalamualaikum, saya ingin tanya program Tabungan Umroh MQH')} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4 mr-1.5" /> Konsultasi Tabungan
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
                  <p className="text-xs text-amber-300 font-semibold uppercase">Mulai Dari</p>
                  <p className="font-serif text-2xl font-bold">Rp 500 Ribu</p>
                  <p className="text-[11px] text-emerald-100/70">Per bulan sesuai target</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
                  <p className="text-xs text-amber-300 font-semibold uppercase">Pilihan Waktu</p>
                  <p className="font-serif text-2xl font-bold">6 - 36 Bulan</p>
                  <p className="text-[11px] text-emerald-100/70">Fleksibel & amanah</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
                  <p className="text-xs text-amber-300 font-semibold uppercase">Sistem</p>
                  <p className="font-serif text-2xl font-bold">100% Syariah</p>
                  <p className="text-[11px] text-emerald-100/70">Bebas riba & denda</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
                  <p className="text-xs text-amber-300 font-semibold uppercase">Jaminan</p>
                  <p className="font-serif text-2xl font-bold">Pasti Berangkat</p>
                  <p className="text-[11px] text-emerald-100/70">Saat target terpenuhi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONI JAMAAH */}
        {TESTIMONI_LIST.length > 0 && (
          <section className="bg-gradient-to-b from-white via-amber-50/20 to-white py-16 md:py-24 border-y border-amber-100/50">
            <div className="max-w-[1240px] mx-auto px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-bold uppercase tracking-wider">
                  <Star className="size-3.5 text-amber-600 fill-amber-500" /> Testimoni Jamaah
                </div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c2417] tracking-tight">
                  Pengalaman Berkesan Bersama MQH
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Cerita ketenangan dan kepuasan ibadah dari jamaah yang telah menunaikan panggilan suci.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {TESTIMONI_LIST.map((testimoni) => (
                  <div
                    key={testimoni.namaSumber}
                    className="p-8 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-4 fill-amber-400" />
                        ))}
                      </div>
                      <blockquote className="text-xs md:text-sm leading-relaxed text-gray-700 italic">
                        &ldquo;{testimoni.isi}&rdquo;
                      </blockquote>
                    </div>

                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                      <div className="size-10 rounded-full bg-gradient-to-br from-emerald-600 to-amber-600 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                        {testimoni.namaSumber.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{testimoni.namaSumber}</p>
                        <p className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-600" /> Jamaah Terverifikasi
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. BERITA & ARTIKEL EDUKASI */}
        {artikelList && artikelList.length > 0 && (
          <section className="max-w-[1240px] mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="size-3.5 text-emerald-600" /> Edukasi &amp; Berita
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0c2417]">
                  Panduan Ibadah &amp; Berita Terkini
                </h2>
              </div>
              <Button asChild variant="outline" size="sm" className="h-9 font-semibold text-xs border-gray-300 gap-1 rounded-lg">
                <Link href="/artikel">
                  Lihat Semua Artikel <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {artikelList.map((a) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="group block space-y-4">
                  <div className="relative h-52 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <PhotoBlock
                      imageUrl={a.gambar_url}
                      alt={a.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10.5px] font-bold text-emerald-800">
                      {a.kategori ?? 'Panduan'}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-gray-400 font-medium">{formatTanggal(a.diterbitkan_pada)}</p>
                    <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                      {a.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 8. INSTAGRAM FEED */}
        <section className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Komunitas &amp; Dokumentasi</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0c2417]">
              Ikuti Perjalanan Jamaah di Instagram
            </h2>
            <p className="text-xs text-gray-500">{INSTAGRAM_BIO}</p>
          </div>

          {instagramPosts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {instagramPosts.map((post, i) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`aspect-square relative rounded-2xl overflow-hidden group block border border-gray-200 ${i === 4 ? 'hidden md:block' : ''}`}
                >
                  <Image
                    src={post.mediaUrl}
                    alt="Dokumentasi Jamaah"
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="size-6 text-amber-400" />
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button asChild className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-semibold rounded-xl h-10 px-6 gap-2 shadow-sm">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Camera className="size-4 text-amber-400" /> Kunjungi @{INSTAGRAM_HANDLE}
              </a>
            </Button>
          </div>
        </section>

        {/* 9. PARTNER MASKAPAI & HOTEL */}
        {((maskapaiList?.length ?? 0) > 0 || (hotelList?.length ?? 0) > 0) && (
          <section className="bg-gray-100/60 py-12 border-t border-gray-200/60">
            <div className="max-w-[1240px] mx-auto px-4 md:px-6 text-center space-y-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Mitra Resmi Penerbangan &amp; Akomodasi Internasional
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                {maskapaiList.map((m) => (
                  <span key={m.id} className="text-xs font-semibold text-gray-600 bg-white px-3.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                    ✈️ {m.nama}
                  </span>
                ))}
                {hotelList.map((h) => (
                  <span key={h.id} className="text-xs font-medium text-gray-600 bg-white px-3.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                    🏨 {h.nama} ({h.kota})
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}