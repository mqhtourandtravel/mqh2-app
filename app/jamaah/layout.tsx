import type { Metadata } from 'next'
import AdminShell from '@/components/AdminShell'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function JamaahLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
