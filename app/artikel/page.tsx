import type { Metadata } from 'next'
import { getArtikelTerbit } from '@/lib/queries'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import PageHero from '@/components/PageHero'
import PhotoBlock from '@/components/PhotoBlock'
import { SITE_NAME } from '@/lib/config'

export const revalidate = 60

export const metadata: Metadata = {
  title: `Artikel & Tips | ${SITE_NAME}`,
  description: 'Informasi seputar ibadah umroh, haji, dan tips perjalanan spiritual dari MQH Tour & Travel.',
}

export default async function DaftarArtikel() {
  const artikelList = await getArtikelTerbit()

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <PageHero title="Artikel & Tips" breadcrumb="Artikel" desc="Informasi seputar ibadah dan perjalanan spiritual" />
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {artikelList.map((a) => (
            <Link key={a.id} href={`/artikel/${a.slug}`} className="group">
              <div className="relative h-[190px] rounded-xl overflow-hidden mb-4">
                <PhotoBlock imageUrl={a.gambar_url} alt={a.judul} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-[11px] text-muted-foreground mb-1.5">
                {new Date(a.diterbitkan_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                {a.kategori && ` · ${a.kategori}`}
              </p>
              <h3 className="font-serif text-[18px] font-medium text-primary leading-snug group-hover:text-secondary-hover transition mb-2">
                {a.judul}
              </h3>
              {a.ringkasan && <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{a.ringkasan}</p>}
            </Link>
          ))}
          {artikelList.length === 0 && <p className="text-muted-foreground text-sm py-12">Belum ada artikel.</p>}
        </div>
      </div>
</div>
  )
}
