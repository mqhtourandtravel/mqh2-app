// JSON-LD structured data (Kelompok E SEO).
// Semua builder return plain object siap di-serialize ke <script type="application/ld+json">.
// URL selalu absolut (relatif → digabung SITE_URL) sesuai syarat Google.

import {
  SITE_URL, SITE_NAME, SITE_DESC, NOMOR_WA, CABANG_LIST,
  INSTAGRAM_URL, FACEBOOK_URL, TIKTOK_URL, YOUTUBE_URL,
} from './config'

const abs = (u?: string | null): string | undefined => {
  if (!u) return undefined
  return u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`
}

/** Entitas MQH — dipakai di homepage (TravelAgency penuh) & direferensikan halaman detail. */
export function travelAgencySchema() {
  const pusat = CABANG_LIST[0]
  const [addressLocality, addressRegion] = (pusat?.alamat ?? '').split(',').map((s) => s.trim())
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#travelagency`,
    name: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    logo: abs('/logo.png'),
    image: abs('/images/hero.jpg'),
    telephone: `+${NOMOR_WA}`,
    priceRange: 'Rp 1.900.000 - Rp 130.000.000', // rentang riil layanan (badal s.d. haji khusus) per katalog Sept 2026
    address: {
      '@type': 'PostalAddress',
      streetAddress: pusat?.alamat ?? undefined,
      addressLocality: addressLocality || undefined,
      addressRegion: addressRegion || undefined,
      addressCountry: 'ID',
    },
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL, TIKTOK_URL, YOUTUBE_URL],
  }
}

type PaketLite = {
  nama_paket: string
  slug: string
  kategori?: string | null
  deskripsi?: string | null
  gambar_url?: string | null
}
type JadwalLite = {
  harga_normal: number
  harga_promo?: number | null
  durasi_hari?: number | null
}

/**
 * Halaman /paket/[slug].
 * @type gabungan Product + TouristTrip: Product = tipe yang didukung luas utk
 * rich result harga (offers); TouristTrip = semantik perjalanan (tripDuration).
 */
export function paketJsonLd(paket: PaketLite, jadwal: JadwalLite[]) {
  const harga = jadwal.flatMap((j) =>
    [j.harga_normal, j.harga_promo ?? null].filter((n): n is number => typeof n === 'number' && n > 0))
  const durasi = jadwal.find((j) => j.durasi_hari)?.durasi_hari
  const offers = harga.length
    ? {
        '@type': 'AggregateOffer',
        priceCurrency: 'IDR',
        lowPrice: String(Math.min(...harga)),
        highPrice: String(Math.max(...harga)),
        offerCount: String(jadwal.length),
        availability: 'https://schema.org/InStock',
      }
    : undefined
  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'TouristTrip'],
    name: paket.nama_paket,
    description: paket.deskripsi || `${paket.nama_paket} — paket ${paket.kategori ?? 'umroh'} dari ${SITE_NAME}.`,
    url: `${SITE_URL}/paket/${paket.slug}`,
    image: abs(paket.gambar_url) ?? abs('/images/hero.jpg'),
    category: paket.kategori ?? undefined,
    ...(durasi ? { tripDuration: `P${durasi}D` } : {}),
    ...(offers ? { offers } : {}),
    // Brand di-inline penuh (bukan @id) supaya valid tanpa bergantung script halaman lain.
    brand: { '@type': 'Brand', name: SITE_NAME, url: SITE_URL },
  }
}

type ArtikelLite = {
  judul: string
  slug: string
  ringkasan?: string | null
  gambar_url?: string | null
  diterbitkan_pada?: string | Date | null
  kategori?: string | null
}

/** Halaman /artikel/[slug]. Penulis = organisasi (DB tidak punya field author personal). */
export function artikelJsonLd(a: ArtikelLite) {
  const tanggal = a.diterbitkan_pada
    ? new Date(a.diterbitkan_pada).toISOString()
    : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.judul,
    description: a.ringkasan ?? a.judul,
    image: [abs(a.gambar_url) ?? abs('/images/hero.jpg')],
    datePublished: tanggal,
    dateModified: tanggal,
    inLanguage: 'id',
    articleSection: a.kategori ?? undefined,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: abs('/logo.png') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/artikel/${a.slug}` },
  }
}

/** Helper render di Server Component. */
export function jsonLdScript(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) }
}
