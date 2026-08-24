import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESC, HERO_IMG } from '@/lib/config'
import './globals.css'
import SiteFooter from '@/components/SiteFooter'

// Display font untuk heading/H1-H4/hero/KPI (weights 600, 700)
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

// Body/UI font untuk body/nav/button/form/table (weights 400-600)
// 700 tidak di-load: semua bold di body/UI sudah dinormalisasi ke 600 (semibold);
// angka penting/heading memakai Plus Jakarta Sans 700 via token --font-display.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Catatan: tidak pakai title.template karena setiap page.tsx sudah
  // menambahkan "| ${SITE_NAME}" sendiri di title-nya masing-masing.
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESC,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESC,
    url: SITE_URL,
    images: [{ url: HERO_IMG, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESC,
    images: [HERO_IMG],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${manrope.variable} bg-background text-foreground antialiased`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}