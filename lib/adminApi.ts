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

function apiError(json: Record<string, unknown>, fallback: string): string {
  const err = json.error
  return typeof err === 'string' ? err : fallback
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
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal menyimpan data.') }
  return { data: json as T, error: null }
}

export async function adminUpdate<T = unknown>(resource: string, id: string, data: Record<string, unknown>): Promise<{ data: T | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/${resource}/${id}`, { method: 'PATCH', headers, body: JSON.stringify(data) })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal menyimpan data.') }
  return { data: json as T, error: null }
}

export async function adminDelete(resource: string, id: string): Promise<{ ok: boolean; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/${resource}/${id}`, { method: 'DELETE', headers })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { ok: false, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { ok: false, error: apiError(json, 'Gagal menghapus data.') }
  return { ok: true, error: null }
}

/**
 * Ubah role user. Hanya staff_admin yang bisa.
 * Endpoint terpisah: /api/admin/users/[id]/role
 */
export async function adminChangeRole(
  userId: string,
  role: string,
): Promise<{ data: unknown | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ role }),
  })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal mengubah role.') }
  return { data: json, error: null }
}

/**
 * Assign jamaah ke agen. Staff admin only.
 */
export async function agentAssignJamaah(
  userId: string,
  agenId: string | null,
): Promise<{ data: unknown | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch('/api/agent/jamaah/assign', {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: userId, agen_id: agenId }),
  })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal assign jamaah.') }
  return { data: json, error: null }
}

/**
 * Lihat jamaah binaan. Agen lihat sendiri, admin lihat semua.
 */
export async function agentListJamaah<T = unknown>(
  opts: { search?: string } = {},
): Promise<T[]> {
  const headers = await authHeader()
  const sp = new URLSearchParams()
  if (opts.search) sp.set('search', opts.search)
  const res = await fetch(`/api/agent/jamaah?${sp.toString()}`, { headers })
  if (!res.ok) return []
  return res.json()
}

// ── Bookings ──

export async function bookingList<T = unknown>(
  opts: { status?: string } = {},
): Promise<T[]> {
  const headers = await authHeader()
  const sp = new URLSearchParams()
  if (opts.status) sp.set('status', opts.status)
  const res = await fetch(`/api/bookings?${sp.toString()}`, { headers })
  if (!res.ok) return []
  return res.json()
}

export async function bookingGet<T = unknown>(id: string): Promise<T | null> {
  const headers = await authHeader()
  const res = await fetch(`/api/bookings/${id}`, { headers })
  if (!res.ok) return null
  return res.json()
}

export async function bookingCreate(
  keberangkatanId: string,
  catatan?: string,
): Promise<{ data: unknown | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers,
    body: JSON.stringify({ keberangkatan_id: keberangkatanId, catatan }),
  })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal membuat booking.') }
  return { data: json, error: null }
}

export async function bookingUpdateStatus(
  id: string,
  status: string,
): Promise<{ data: unknown | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch(`/api/bookings/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal update status.') }
  return { data: json, error: null }
}

// ── Me (profil user sendiri) ──

export async function meGet<T = unknown>(): Promise<T | null> {
  const headers = await authHeader()
  const res = await fetch('/api/me', { headers })
  if (!res.ok) return null
  return res.json()
}

export async function meUpdate(
  data: Record<string, string>,
): Promise<{ data: unknown | null; error: string | null }> {
  const headers = await authHeader()
  const res = await fetch('/api/me', {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  })
  let json: Record<string, unknown>
  try {
    json = await res.json()
  } catch {
    return { data: null, error: `Server error (${res.status})` }
  }
  if (!res.ok) return { data: null, error: apiError(json, 'Gagal menyimpan profil.') }
  return { data: json, error: null }
}
