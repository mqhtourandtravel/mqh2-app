import type { Metadata } from 'next'
import { getTentangKami } from '@/lib/queries'
import SiteHeader from '@/components/SiteHeader'
import PageHero from '@/components/PageHero'
import { SITE_NAME } from '@/lib/config'

export const revalidate = 60

export const metadata: Metadata = {
  title: `Tentang Kami | ${SITE_NAME}`,
  description: 'Kenali lebih dekat MQH Tour & Travel — perjalanan ibadah umroh dan haji yang amanah dan profesional.',
}

export default async function TentangKamiPage() {
  const t = await getTentangKami()

  const angka = t ? [
    { label: t.angka_1_label, nilai: t.angka_1_nilai },
    { label: t.angka_2_label, nilai: t.angka_2_nilai },
    { label: t.angka_3_label, nilai: t.angka_3_nilai },
    { label: t.angka_4_label, nilai: t.angka_4_nilai },
  ].filter((a) => a.nilai) : []

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <PageHero title="Tentang Kami" breadcrumb="About Us" />
      <div className="max-w-[820px] mx-auto px-5 md:px-20 pb-24">
        {t?.cerita && (
          <div className="text-[15px] leading-relaxed text-primary/90 whitespace-pre-wrap mb-14">{t.cerita}</div>
        )}
        {angka.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {angka.map((a, i) => (
              <div key={i} className="bg-white rounded-xl border border-accent p-6 text-center">
                <p className="font-serif text-3xl font-bold text-secondary-hover">{a.nilai}</p>
                <p className="text-[12px] text-muted-foreground mt-1.5">{a.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
</div>
  )
}
