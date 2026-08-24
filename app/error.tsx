'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

// Error boundary route-level: menangkap error render di segmen app mana pun.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <h1 className="font-serif text-[24px] md:text-[28px] font-semibold text-primary mb-3">
        Terjadi Kesalahan
      </h1>
      <p className="text-[14px] text-muted-foreground max-w-md leading-relaxed mb-8">
        Mohon maaf, ada kendala saat memuat halaman ini. Silakan coba lagi.
      </p>
      <Button variant="secondary" onClick={reset}>
        Coba Lagi
      </Button>
    </main>
  )
}
