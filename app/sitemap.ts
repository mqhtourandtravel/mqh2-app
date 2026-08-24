import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getArtikelTerbit } from '@/lib/queries'
import { SITE_URL } from '@/lib/config'

// Sitemap dinamis: halaman statis + semua slug paket & artikel terbit.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [paketRows, artikelRows] = await Promise.all([
    prisma.paket.findMany({ select: { slug: true } }),
    getArtikelTerbit(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    '', '/paket', '/artikel', '/cabang', '/kontak', '/tentang',
    '/partnership', '/tabungan-umroh',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  return [
    ...staticPages,
    ...paketRows.map((p) => ({
      url: `${SITE_URL}/paket/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...artikelRows.map((a) => ({
      url: `${SITE_URL}/artikel/${a.slug}`,
      lastModified: a.diterbitkan_pada ? new Date(a.diterbitkan_pada) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
