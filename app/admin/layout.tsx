import type { Metadata } from 'next'

// Panel internal (admin, jamaah, agent) — tidak boleh ke-index Google.
// Top-level layout membungkus semua halaman panel.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
