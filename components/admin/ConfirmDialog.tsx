'use client'

// Pengganti confirm() browser — API imperatif berbasis Promise.
//   const ok = await confirmDialog({ title, description, actionLabel, destructive })
// Host <ConfirmDialogHost/> dipasang sekali di AdminShell; listener module-level
// membuat fungsi confirmDialog() bisa dipanggil dari halaman mana pun (admin,
// agen, jamaah) tanpa prop-drilling/context.

import { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

export type ConfirmOptions = {
  title: string
  description?: string
  actionLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

type Request = { opts: ConfirmOptions; resolve: (ok: boolean) => void }

let listener: ((req: Request) => void) | null = null

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    listener?.({ opts, resolve })
  })
}

export function ConfirmDialogHost() {
  const [req, setReq] = useState<Request | null>(null)
  const reqRef = useRef<Request | null>(null)
  reqRef.current = req

  useEffect(() => {
    listener = (incoming) => {
      // kalau ada dialog lama belum ter-resolve (mis. navigasi) — tutup dgn false
      reqRef.current?.resolve(false)
      setReq(incoming)
    }
    return () => { listener = null }
  }, [])

  const settle = (ok: boolean) => {
    if (!req) return
    setReq(null)
    req.resolve(ok)
  }

  const { opts } = req ?? { opts: null as ConfirmOptions | null }

  return (
    <AlertDialog open={!!req} onOpenChange={(open) => { if (!open) settle(false) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{opts?.title}</AlertDialogTitle>
          {opts?.description && <AlertDialogDescription>{opts.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => settle(false)}>{opts?.cancelLabel ?? 'Batal'}</AlertDialogCancel>
          <button
            type="button"
            onClick={() => settle(true)}
            className={cn(
              'inline-flex h-9 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              opts?.destructive
                ? 'bg-[#E05252] hover:bg-[#c84343]'
                : 'bg-emerald-700 hover:bg-emerald-800'
            )}
          >
            {opts?.actionLabel ?? 'Konfirmasi'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
