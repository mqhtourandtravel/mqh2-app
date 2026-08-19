import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PhotoBlock from '@/components/PhotoBlock'
import { waLink } from '@/lib/utils'
import { SITE_NAME } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: `Tabungan Umroh | ${SITE_NAME}`,
  description: 'Rencanakan ibadah umroh Anda dengan Tabungan Umroh MQH — setoran ringan, tanpa biaya admin, dan dikelola sesuai prinsip syariah.',
}

const linkWaTabungan = waLink('Assalamualaikum, saya ingin buka Tabungan Umroh MQH')

const FITUR = [
  { icon: 'savings', title: 'Setoran Awal Ringan', desc: 'Mulai menabung dengan nominal yang sangat terjangkau untuk memudahkan langkah awal ibadah Anda.', dark: false },
  { icon: 'money_off', title: 'Tanpa Biaya Admin', desc: 'Saldo tabungan Anda tetap utuh tanpa potongan biaya administrasi bulanan, sehingga dana terkumpul lebih maksimal.', dark: true },
  { icon: 'security', title: 'Keamanan Terjamin', desc: 'Dana Anda dikelola secara aman dan transparan melalui mitra perbankan syariah terpercaya.', dark: false },
]

export default function TabunganUmrohPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative pt-40 pb-20 px-5 md:px-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <PhotoBlock className="w-full h-full" />
        </div>
        <div className="relative max-w-[1280px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="soft" className="bg-white border border-secondary/40 text-secondary-hover mb-5 normal-case tracking-wider">
              Tabungan Umroh
            </Badge>
            <h1 className="font-serif text-[36px] md:text-[48px] font-semibold text-primary leading-[1.15] mb-5">
              Tabungan Umroh:<br />
              <em className="not-italic text-secondary">Rencanakan Ibadah Suci Anda</em>
            </h1>
            <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-8 max-w-md">
              Mulailah langkah spiritual Anda dengan perencanaan yang matang. Tabungan Umroh MQH Travel membantu Anda mengelola dana ibadah secara aman, terencana, dan profesional sesuai prinsip syariah.
            </p>
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider mb-1">Setoran Awal Mulai</p>
                <p className="font-serif text-3xl font-bold text-primary">2 Juta</p>
              </div>
              <Button asChild size="lg">
                <a href={linkWaTabungan} target="_blank" rel="noopener noreferrer">
                  Buka Tabungan Sekarang
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PhotoBlock className="h-64 rounded-2xl" />
            <PhotoBlock className="h-64 rounded-2xl mt-8" />
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="bg-muted py-24 px-5 md:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[30px] md:text-[36px] font-medium text-primary mb-3">
              Keunggulan Tabungan Umroh Kami
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Wujudkan impian ke Tanah Suci dengan sistem menabung yang aman, transparan, dan dikelola secara profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {FITUR.map((f) => (
              <Card key={f.title} className={`glass-panel p-8 hover:-translate-y-1 transition-transform duration-300 border-none ${f.dark ? 'bg-primary text-primary-foreground' : 'bg-white'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${f.dark ? 'bg-white/10' : 'bg-secondary/20'}`}>
                  <span className={`material-symbols-outlined ${f.dark ? 'text-secondary' : 'text-primary'}`}>{f.icon}</span>
                </div>
                <h3 className={`font-serif text-xl mb-3 ${f.dark ? 'text-secondary' : 'text-primary'}`}>{f.title}</h3>
                <p className={`text-[13.5px] leading-relaxed ${f.dark ? 'text-white/80' : 'text-muted-foreground'}`}>{f.desc}</p>
              </Card>
            ))}
          </div>

          <Card className="glass-panel bg-white p-8 flex flex-col md:flex-row gap-6 items-center hover:-translate-y-1 transition-transform duration-300 border-none">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">event_available</span>
              </div>
              <h3 className="font-serif text-xl text-primary mb-3">Bebas Pilih Jadwal</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                Setelah target tabungan tercapai, Anda bebas menentukan jadwal keberangkatan sesuai paket yang tersedia.
              </p>
            </div>
            <PhotoBlock className="w-full md:w-1/3 h-40 rounded-xl shrink-0" />
          </Card>
        </div>
      </section>

      {/* CTA CLOSING */}
      <section className="bg-primary text-primary-foreground py-24 px-5 md:px-20 text-center">
        <div className="max-w-[680px] mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Mulai Langkah Anda</p>
          <h2 className="font-serif text-[28px] md:text-[36px] font-semibold mb-5 leading-tight">
            Mulai Menabung untuk Ibadah Umroh Anda Hari Ini
          </h2>
          <p className="text-[14px] text-primary-foreground/80 leading-relaxed mb-10 max-w-lg mx-auto">
            Dapatkan panduan perencanaan keuangan dan simulasi target tabungan secara gratis. Tim kami siap membantu Anda merencanakan perjalanan suci dengan tenang.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" size="lg">
              <a href={linkWaTabungan} target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-[16px]">forum</span>
                Buka Tabungan Sekarang
              </a>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <a href="/brosur-tabungan-umroh.pdf" download target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-[16px]">download</span>
                Unduh Brosur PDF
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
