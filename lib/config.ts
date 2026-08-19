// App-wide constants
// Edit di sini, bukan hardcode di setiap page

export const NOMOR_WA = process.env.NEXT_PUBLIC_NOMOR_WA || '6285868969000'
export const HERO_IMG = process.env.NEXT_PUBLIC_HERO_IMG || 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1920&q=80&auto=format&fit=crop'

// Dipakai untuk metadataBase & URL absolut di Open Graph/Twitter card.
// Set NEXT_PUBLIC_SITE_URL di env production ke domain asli (mis. https://mqhtour.com).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mqhtour.com'

export const SITE_NAME = 'MQH Tour & Travel'
export const SITE_TAGLINE = 'Perjalanan Spiritual yang Elegan'
export const SITE_DESC = 'Travel umroh & haji terpercaya dengan layanan premium dan pendampingan profesional.'

// Nomor izin resmi (tampil di footer, wajib untuk kepercayaan calon jamaah).
// Sumber: bio Instagram resmi @mqhtourandtravel (dicek 19 Agustus 2026).
// TODO: isi NOMOR_PIHK kalau MQH sudah punya izin Haji Khusus terpisah --
// sengaja dikosongkan (bukan ditulis placeholder) karena nomornya tidak
// ditemukan di sumber publik manapun saat ini.
export const NOMOR_PPIU = '02200064127450010'
export const NOMOR_PIHK = ''

// Instagram resmi
export const INSTAGRAM_HANDLE = 'mqhtourandtravel'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`
export const INSTAGRAM_BIO = 'Pemberangkatan Umroh & Haji. Fasilitas Terbaik, Amanah, Nyaman, Profesional dan Sesuai Syariat.'

// Kategori paket yang didukung
export const KATEGORI_PAKET = ['umroh', 'haji', 'badal', 'tour'] as const

// Filter options
export const BULAN_LABELS = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
] as const