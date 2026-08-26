import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESC, HERO_IMG } from '@/lib/config'
import './globals.css'
import SiteFooter from '@/components/SiteFooter'

// Body font — Inter (sesuai referensi)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Heading/Display font — Playfair Display (sesuai referensi)
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
      <head>
        <style dangerouslySetInnerHTML={{ __html: '::-webkit-scrollbar{display:none}' }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-background text-foreground antialiased`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}