import type { Metadata } from 'next'

// Panel agen — noindex, tidak boleh ke-index Google.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
