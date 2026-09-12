'use client'

import { useEffect, useState } from 'react'
import { Toaster as SonnerToaster } from 'sonner'

// Toaster global — theme di-follow dari class .admin-dark di <html>
// (arsitektur dark mode custom project ini via AdminShell, BUKAN .dark next-themes).
// Warna sukses/error diset via CSS var sonner di globals.css (--success-background dkk).
export function AppToaster() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('admin-dark'))
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  return (
    <SonnerToaster
      position="top-right"
      theme={isDark ? 'dark' : 'light'}
      richColors
      closeButton
      toastOptions={{ duration: 4000 }}
    />
  )
}
