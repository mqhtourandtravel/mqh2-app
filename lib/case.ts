// Util konversi nama field antara snake_case (dipakai di seluruh halaman/komponen,
// warisan dari kolom Supabase) dan camelCase (dipakai oleh Prisma Client).
// Dengan ini kita TIDAK perlu mengubah nama field di komponen/halaman yang sudah ada --
// cukup konversi di titik masuk/keluar query Prisma.

export function snakeToCamel(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

export function camelToSnake(s: string): string {
  return s
    .replace(/([a-zA-Z])([0-9])/g, '$1_$2') // huruf -> angka, mis. angka1 -> angka_1
    .replace(/([0-9])([A-Z])/g, '$1_$2')    // angka -> Huruf besar, mis. 1Label -> 1_Label
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // huruf kecil/angka -> Huruf besar, mis. hotelMekkah -> hotel_Mekkah
    .toLowerCase()
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && !(v instanceof Date)
}

// Prisma Decimal punya method .toNumber(), field created dari @db.Decimal.
function isDecimalLike(v: unknown): v is { toNumber: () => number } {
  return typeof v === 'object' && v !== null && 'toNumber' in v && typeof v.toNumber === 'function'
}

// Ubah semua key sebuah objek/array (rekursif) dari camelCase -> snake_case.
// Dipakai untuk hasil query Prisma sebelum dikirim ke komponen/JSON response.
export function keysToSnake(value: unknown): unknown {
  if (isDecimalLike(value)) return value.toNumber()
  if (value instanceof Date) return value
  if (Array.isArray(value)) return value.map(keysToSnake)
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[camelToSnake(k)] = keysToSnake(v)
    }
    return out
  }
  return value
}

// Ubah semua key sebuah objek (rekursif) dari snake_case -> camelCase.
// Dipakai untuk body request (form admin) sebelum dipakai sebagai data Prisma.
export function keysToCamel(value: unknown): unknown {
  if (value instanceof Date) return value
  if (Array.isArray(value)) return value.map(keysToCamel)
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[snakeToCamel(k)] = keysToCamel(v)
    }
    return out
  }
  return value
}
