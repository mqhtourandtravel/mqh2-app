'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { setStoredReferral } from '@/lib/referral'
import { toast } from 'sonner'

function ReferralListener() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const refCode = searchParams.get('ref') || searchParams.get('agen')
    if (refCode) {
      const clean = refCode.trim()
      setStoredReferral(clean)
      toast.info(`Selamat datang! Anda terhubung melalui Mitra Resmi MQH: ${clean}`, {
        duration: 4000,
      })
    }
  }, [searchParams])

  return null
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralListener />
    </Suspense>
  )
}
