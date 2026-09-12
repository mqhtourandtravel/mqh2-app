'use client'

// ImageUpload — drop-in pengganti input URL gambar utk form admin (paket & artikel).
// Pilih/klik/drag-drop file → upload ke /api/upload (Vercel Blob) → onChange(URL publik).
// Field form tetap sama (gambar_url), hanya sumber value berubah dari ketik manual ke upload.

import { useCallback, useRef, useState } from 'react'
import { Loader2, Trash2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB — sinkron dg validasi server

type Props = {
  value: string | null | undefined
  onChange: (url: string | null) => void
  label?: string
  id?: string
}

export function ImageUpload({ value, onChange, label = 'Gambar', id = 'gambar' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const unggah = useCallback(async (file: File) => {
    setError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format harus JPG, PNG, atau WEBP.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError(`Ukuran ${(file.size / 1024 / 1024).toFixed(1)}MB melebihi batas 5MB.`)
      return
    }
    setUploading(true)
    try {
      // Endpoint /api/upload dijaga verifyAdmin — kirim Bearer token sesi seperti adminApi.ts
      const { data: { session } } = await supabase.auth.getSession()
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: fd,
      })
      const json = await res.json().catch(() => ({ error: `Server error (${res.status})` }))
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Upload gagal.')
        return
      }
      onChange(json.url as string)
    } catch {
      setError('Upload gagal — periksa koneksi.')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) void unggah(f)
    e.target.value = '' // allow pilih file sama ulang
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) void unggah(f)
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium leading-none">{label}</label>
      <input ref={inputRef} id={id} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPick} />

      {value && !uploading ? (
        // Preview gambar tersimpan/terupload + aksi ganti/hapus
        <div className="relative w-full max-w-sm aspect-video rounded-lg border overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview gambar" className="size-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs" disabled={uploading}
              onClick={() => inputRef.current?.click()}>
              Ganti
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" disabled={uploading}
              onClick={() => onChange(null)}>
              <Trash2 className="size-3" /> Hapus
            </Button>
          </div>
        </div>
      ) : (
        // Drop zone / klik pilih
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={uploading}
          className={`flex w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/60 hover:bg-muted/50'
          } disabled:opacity-60`}
        >
          {uploading ? (
            <><Loader2 className="size-5 animate-spin text-primary" /><span className="font-medium">Mengupload...</span></>
          ) : (
            <>
              <UploadCloud className="size-5 text-muted-foreground" />
              <span className="text-muted-foreground">Klik atau seret gambar ke sini <span className="font-medium">(JPG/PNG/WEBP, maks 5MB)</span></span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
