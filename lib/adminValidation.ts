// Validasi server-side utk mutation via /api/admin/[resource] (POST/PATCH),
// SEBELUM data masuk Prisma. Whitelist eksplisit per resource:
// - paket: nama_paket + slug wajib (hanya saat keduanya adalah key di payload)
// - keberangkatan: numeric fields finite & >= 0; kuota_tersisa <= kuota_total
//   (cek terakhir hanya bila KEDUANYA hadir di payload — PATCH parsial tanpa
//   kuota_total tidak dicek terhadap nilai tersimpan; sengaja, supaya tidak
//   fetch row lama per request)
// Resource lain (artikel, maskapai, hotel, user) lolos tanpa validasi.
// Mengembalikan pesan error (string) atau null kalau valid.

const NUMERIC_FIELDS = ['harga_normal', 'harga_promo', 'kuota_total', 'kuota_tersisa'] as const

function isNum(v: unknown): boolean {
  return typeof v === 'number' && Number.isFinite(v)
}

function isNonEmptyString(v: unknown): boolean {
  return typeof v === 'string' && v.trim().length > 0
}

// resource: string — route generik menerima nama resource dari URL; whitelist
// resource sudah diverifikasi getResource() sebelum fungsi ini dipanggil.
export function validateAdminPayload(
  resource: string,
  data: Record<string, unknown>,
): string | null {
  if (resource === 'paket') {
    if ('nama_paket' in data && !isNonEmptyString(data.nama_paket)) {
      return 'Field wajib kosong: nama_paket harus terisi.'
    }
    if ('slug' in data && !isNonEmptyString(data.slug)) {
      return 'Field wajib kosong: slug harus terisi.'
    }
    return null
  }

  if (resource === 'hotel') {
    // Kunci domain kota — cegah drift ejaan masuk DB lewat API langsung
    // (form UI sudah Select 2 opsi; ini pagar server-side-nya).
    if ('kota' in data && !['mekkah', 'madinah'].includes(String(data.kota))) {
      return 'Field kota harus "mekkah" atau "madinah".'
    }
    return null
  }

  if (resource === 'keberangkatan') {
    for (const f of NUMERIC_FIELDS) {
      if (f in data && data[f] !== null) {
        const v = data[f]
        if (!isNum(v) || (v as number) < 0) {
          return `Field numerik tidak valid: ${f} harus angka ≥ 0.`
        }
      }
    }
    if (
      'kuota_tersisa' in data && 'kuota_total' in data &&
      isNum(data.kuota_tersisa) && isNum(data.kuota_total) &&
      (data.kuota_tersisa as number) > (data.kuota_total as number)
    ) {
      return 'kuota_tersisa tidak boleh lebih besar dari kuota_total.'
    }
    return null
  }

  return null
}
