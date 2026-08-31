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

// Gate role: /agent/* untuk agen + staff_admin.
export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  if (!user) redirect('/admin/login?next=/agent')
  if (user.role === ROLES.PENDING) redirect('/auth/choose-role')
  if (user.role === ROLES.JAMAAH) redirect('/jamaah')

  return <AdminShell>{children}</AdminShell>
}