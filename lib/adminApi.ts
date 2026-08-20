'use client'

import { supabase } from '@/lib/supabase'

// Prisma tidak bisa dipanggil langsung dari browser, jadi semua halaman admin
// ('use client') memanggil endpoint /api/admin/* ini, yang di baliknya memakai
// Prisma di server. Token sesi Supabase Auth tetap dipakai untuk membuktikan
// bahwa yang memanggil adalah admin yang sudah login (lihat lib/adminAuth.ts).

async function authHeader(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

export async function adminList<T = unknown>(
  resource: string,
  opts: { orderBy?: string; dir?: 'asc' | 'desc'; filter?: Record<string, string> } = {}
): Promise<T[]> {
  const headers = await authHeader()
  const sp = new URLSearchParams()
  if (opts.orderBy) sp.set('orderBy', opts.orderBy)
  if (opts.dir) sp.set('dir', opts.dir)
  if (opts.filter) Object.entries(opts.filter).forEach(([k, v]) => sp.set(k, v))
  const res = await fetch(`/api/admin/${resource}?${sp.toString()}`, { headers })
  if (!res.ok) return []
  return res.json()
}

export async function adminGet<T = unknown>(resource: string, id: string): Promise<T | null> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/${resource}/${id}`, { headers })
  if (!res.ok) return null
  return res.json()
}

export async function adminCreate<T = unknown>(resource: string, data: Record<string, unknown>): Promise<{ data: T | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/${resource}`, { method: 'POST', headers, body: JSON.stringify(data) })
  const json = await res.json()
  if (!res.ok) return { data: null, error: json.error ?? 'Gagal menyimpan data.' }
  return { data: json, error: null }
}

export async function adminUpdate<T = unknown>(resource: string, id: string, data: Record<string, unknown>): Promise<{ data: T | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/${resource}/${id}`, { method: 'PATCH', headers, body: JSON.stringify(data) })
  const json = await res.json()
  if (!res.ok) return { data: null, error: json.error ?? 'Gagal menyimpan data.' }
  return { data: json, error: null }
}

export async function adminDelete(resource: string, id: string): Promise<{ ok: boolean; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/${resource}/${id}`, { method: 'DELETE', headers })
  const json = await res.json()
  if (!res.ok) return { ok: false, error: json.error ?? 'Gagal menghapus data.' }
  return { ok: true, error: null }
}
