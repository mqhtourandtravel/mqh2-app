// Referral tracking helper untuk program kemitraan / agen MQH Tour & Travel.
// Menyimpan kode referensi di cookie (30 hari) & localStorage agar awet antar sesi.

export const REFERRAL_KEY = 'mqh_referral'
export const REFERRAL_COOKIE = 'mqh_ref'

export function getStoredReferral(): string | null {
  if (typeof window === 'undefined') return null

  // 1. Coba dari cookie
  try {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${REFERRAL_COOKIE})=([^;]*)`))
    if (match && match[3]) {
      return decodeURIComponent(match[3])
    }
  } catch {
    // Abaikan error parsing cookie
  }

  // 2. Fallback dari localStorage
  try {
    return localStorage.getItem(REFERRAL_KEY)
  } catch {
    return null
  }
}

export function setStoredReferral(code: string): void {
  if (typeof window === 'undefined') return
  const cleanCode = code.trim()
  if (!cleanCode) return

  // Simpan di cookie (30 hari)
  try {
    const maxAge = 60 * 60 * 24 * 30 // 30 hari
    document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(cleanCode)}; path=/; max-age=${maxAge}; SameSite=Lax`
  } catch {
    // Abaikan jika cookie diblokir browser
  }

  // Simpan di localStorage
  try {
    localStorage.setItem(REFERRAL_KEY, cleanCode)
  } catch {
    // Abaikan jika storage penuh/diblokir
  }
}
