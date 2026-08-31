import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { getSessionUser, ROLES } from '@/lib/auth'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

// Gate role: /admin/* hanya untuk staff_admin.
// - belum login → login page
// - pending (baru OAuth, belum pilih role) → halaman pilih role
// - agen → dashboard agen, jamaah → dashboard jamaah
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  if (!user) redirect('/admin/login')
  if (user.role === ROLES.PENDING) redirect('/auth/choose-role')
  if (user.role === ROLES.AGEN) redirect('/agent')
  if (user.role === ROLES.JAMAAH) redirect('/jamaah')

  return <AdminShell>{children}</AdminShell>
}