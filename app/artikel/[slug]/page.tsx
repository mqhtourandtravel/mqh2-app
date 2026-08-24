import type { Metadata } from 'next'
import { getArtikelBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import PhotoBlock from '@/components/PhotoBlock'
import { SITE_NAME } from '@/lib/config'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const artikel = await getArtikelBySlug(slug)
  if (!artikel) return { title: `Artikel Tidak Ditemukan | ${SITE_NAME}` }

  return {
    title: `${artikel.judul} | ${SITE_NAME}`,
    description: artikel.ringkasan || `Baca artikel ${artikel.judul} di ${SITE_NAME}.`,
  }
}

export default async function DetailArtikel({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artikel = await getArtikelBySlug(slug)
  if (!artikel) notFound()

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <article className="pt-40 pb-24 px-5 md:px-20 max-w-[820px] mx-auto">
        <p className="text-[12px] text-muted-foreground mb-4">
          <Link href="/" className="hover:text-secondary-hover">Beranda</Link> / <Link href="/artikel" className="hover:text-secondary-hover">Artikel</Link>
        </p>
        {artikel.kategori && (
          <span className="inline-block bg-white border border-secondary/40 text-secondary-hover text-[11px] font-semibold px-3 py-1.5 rounded-full mb-4">
            {artikel.kategori}
          </span>
        )}
        <h1 className="font-serif text-[32px] md:text-[40px] font-semibold text-primary mb-4 leading-tight">
          {artikel.judul}
        </h1>
        <p className="text-[13px] text-muted-foreground pb-8 mb-8 border-b border-accent">
          {new Date(artikel.diterbitkan_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <PhotoBlock imageUrl={artikel.gambar_url} alt={artikel.judul} className="h-[320px] w-full rounded-xl mb-10" sizes="100vw" />
        <div className="text-[15.5px] leading-[1.9] text-primary/90 whitespace-pre-wrap">{artikel.konten}</div>
      </article>
</div>
  )
}
