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
  title: `Program Kemitraan | ${SITE_NAME}`,
  description: 'Bergabung menjadi mitra resmi MQH Tour & Travel — agen independen, cabang resmi, atau kerjasama corporate B2B.',
}

const KEUNGGULAN = [
  { icon: 'payments', title: 'Sistem Komisi Transparan', desc: 'Dapatkan bagi hasil yang jelas dan menguntungkan dengan pencairan komisi tepat waktu melalui dashboard mitra khusus.' },
  { icon: 'folder_open', title: 'Marketing Kit Eksklusif', desc: 'Akses penuh ke materi promosi premium, brosur digital, dan panduan branding untuk mempermudah penjualan Anda.' },
  { icon: 'support_agent', title: 'Support 24/7', desc: 'Tim representatif kami siap mendampingi Anda dan menjawab segala kebutuhan operasional maupun layanan jemaah.' },
]

const TIPE = [
  {
    label: 'Pemula', title: 'Agen Independen', highlight: false,
    poin: ['Komisi per jemaah', 'Akses sistem booking dasar', 'Materi promosi standar'],
    cta: 'Pilih Paket Agen', link: waLink('Assalamualaikum, saya tertarik mendaftar sebagai Agen Independen MQH'),
  },
  {
    label: 'Menengah', title: 'Cabang Resmi', highlight: true, badge: 'Paling Diminati',
    poin: ['Profit sharing eksklusif', 'Hak teritori wilayah', 'Training manajemen lengkap', 'Full akses dashboard cabang'],
    cta: 'Daftar Buka Cabang', link: waLink('Assalamualaikum, saya tertarik membuka Cabang Resmi MQH'),
  },
  {
    label: 'Enterprise', title: 'Corporate B2B', highlight: false,
    poin: ['Harga spesial B2B', 'Kustomisasi itinerary', 'Dedicated Account Manager'],
    cta: 'Hubungi Sales', link: waLink('Assalamualaikum, saya ingin diskusi kerjasama Corporate B2B dengan MQH'),
  },
]

export default function PartnershipPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="pt-40 pb-20 px-5 md:px-20">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-secondary-hover text-[12px] font-bold uppercase tracking-wider mb-4">Program Kemitraan</span>
            <h1 className="font-serif text-[36px] md:text-[48px] font-semibold text-primary leading-[1.15] mb-5">
              Bertumbuh Bersama dalam Khidmat Ibadah
            </h1>
            <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-8 max-w-md">
              Bergabunglah menjadi mitra resmi MQH Tour &amp; Travel. Raih keberkahan bisnis dengan dukungan penuh, sistem transparan, dan komisi yang menjanjikan dalam melayani tamu Allah.
            </p>
            <Button asChild size="lg">
              <a href={waLink('Assalamualaikum, saya ingin daftar sebagai mitra MQH Tour & Travel')} target="_blank" rel="noopener noreferrer">
                Daftar Sebagai Mitra
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </Button>
          </div>
          <PhotoBlock className="h-80 rounded-2xl" />
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="bg-muted py-24 px-5 md:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[30px] md:text-[36px] font-medium text-primary mb-3">Keunggulan Kemitraan</h2>
            <p className="text-[14px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Kami menyediakan ekosistem bisnis yang solid untuk memastikan setiap mitra dapat berkembang dengan maksimal dan melayani jemaah dengan paripurna.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {KEUNGGULAN.map((k) => (
              <Card key={k.title} className="bg-white p-8 border-none">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">{k.icon}</span>
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">{k.title}</h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">{k.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TIPE KEMITRAAN */}
      <section className="py-24 px-5 md:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-14">
            <h2 className="font-serif text-[30px] md:text-[36px] font-medium text-primary mb-3">Tipe Kemitraan</h2>
            <p className="text-[14px] text-muted-foreground max-w-lg leading-relaxed">Pilih skema kerjasama yang paling sesuai dengan kapasitas dan target bisnis Anda.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {TIPE.map((t) => (
              <Card key={t.title} className={`p-8 relative ${t.highlight ? 'bg-secondary/10 border-2 border-secondary' : 'bg-white border-accent'}`}>
                {t.badge && (
                  <Badge className="absolute -top-3 left-8 normal-case tracking-wide">
                    {t.badge}
                  </Badge>
                )}
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t.label}</p>
                <h3 className="font-serif text-xl text-primary mb-5">{t.title}</h3>
                <ul className="space-y-3 mb-8">
                  {t.poin.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[13.5px] text-primary">
                      <span className="material-symbols-outlined text-secondary-hover text-[18px] shrink-0">check_circle</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={t.highlight ? 'secondary' : 'outline'}
                  size="sm"
                  className={t.highlight ? 'w-full' : 'w-full border-primary text-primary bg-transparent hover:bg-primary hover:text-white'}
                >
                  <a href={t.link} target="_blank" rel="noopener noreferrer">{t.cta}</a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CLOSING */}
      <section className="px-5 md:px-20 pb-24">
        <div className="max-w-[1280px] mx-auto relative rounded-3xl overflow-hidden">
          <PhotoBlock className="h-72 w-full" />
          <div className="absolute inset-0 bg-primary/85 flex items-center justify-center text-center px-6">
            <div className="max-w-md">
              <h2 className="font-serif text-[26px] md:text-[32px] font-semibold text-primary-foreground mb-4">
                Siap Melangkah Bersama?
              </h2>
              <p className="text-[13.5px] text-primary-foreground/80 leading-relaxed mb-8">
                Jangan tunda kesempatan untuk menebar manfaat dan meraih kesuksesan bersama MQH Tour &amp; Travel. Tim kemitraan kami siap membantu proses registrasi Anda.
              </p>
              <Button asChild variant="secondary" size="lg">
                <a href={waLink('Assalamualaikum, saya ingin mulai registrasi kemitraan MQH Tour & Travel')} target="_blank" rel="noopener noreferrer">
                  Mulai Registrasi
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
