import * as React from 'react'

import { cn } from '@/lib/utils'

// Catatan: shadcn/ui versi resmi pakai @radix-ui/react-separator, tapi paket
// itu belum terpasang di project ini dan environment build saat ini tidak
// punya akses npm registry untuk menambahkannya. Versi ini functionally
// setara (styling identik, role="separator" untuk aksesibilitas) tanpa
// dependency tambahan. Kalau nanti mau versi Radix penuh, tinggal
// `npx shadcn add separator` lalu ganti implementasi di bawah.
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}) {
  return (
    <div
      data-slot="separator"
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
