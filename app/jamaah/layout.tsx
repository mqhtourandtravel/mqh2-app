import type { Metadata } from 'next'

// Panel jamaah — noindex, tidak boleh ke-index Google.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function JamaahLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
