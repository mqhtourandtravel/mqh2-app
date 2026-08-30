// Validasi parameter pagination untuk endpoint publik (/api/paket).
// Ponytail: clamp, bukan 400 — kontrak theme WordPress mengharapkan angka selalu
// valid. Upgrade path: kembalikan 400 kalau ada konsumen baru yang butuh strict.

const MAX_PAGE = 10_000
const MAX_PER_PAGE = 100

function toPositiveInt(raw: string | null, fallback: number, max: number): number {
  if (raw === null) return fallback
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1) return fallback
  return Math.min(n, max)
}

export function clampPagination(
  page: string | null,
  perPage: string | null,
  defaults: { page?: number; perPage?: number } = {},
): { page: number; perPage: number } {
  return {
    page: toPositiveInt(page, defaults.page ?? 1, MAX_PAGE),
    perPage: toPositiveInt(perPage, defaults.perPage ?? 12, MAX_PER_PAGE),
  }
}
