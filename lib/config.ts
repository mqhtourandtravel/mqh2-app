// App-wide constants
// Edit di sini, bukan hardcode di setiap page

export const NOMOR_WA = process.env.NEXT_PUBLIC_NOMOR_WA || '6285868969000'
// Hero image & video: self-hosted di public folder agar tidak bergantung external URL/embed
export const HERO_IMG = process.env.NEXT_PUBLIC_HERO_IMG || '/images/hero-kaaba.jpg'
export const HERO_VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO || '/videos/hero.mp4'

// Dipakai untuk metadataBase & URL absolut di Open Graph/Twitter card.
// Set NEXT_PUBLIC_SITE_URL di env production ke domain asli (https://mqhtourandtravel.com).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mqhtourandtravel.com'

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

// ===== DATA STATIK (ex-database: tentang, cabang, testimoni) =====
// Konten ini sengaja tidak pakai database — cukup edit file ini.

export const TENTANG_CERITA = `MQH Tour & Travel adalah biro perjalanan ibadah yang berdedikasi menemani perjalanan spiritual Anda ke Tanah Suci dengan pelayanan profesional, pembimbingan syar'i, dan kenyamanan ibadah paripurna.`

export const TENTANG_ANGKA = [
  { label: 'Jamaah Terlayani', nilai: '500+' },
  { label: 'Keberangkatan', nilai: '20+' },
  { label: 'Tahun Pengalaman', nilai: '5+' },
  { label: 'Kepuasan Jamaah', nilai: '98%' },
]

export const CABANG_LIST = [
  {
    nama: 'MQH Tour & Travel - Kantor Pusat',
    tipe: 'pusat',
    kota: 'Pekalongan',
    alamat: 'Pekalongan, Jawa Tengah',
    telepon: null,
    whatsapp: '6285868969000',
    jamLayanan: 'Senin-Sabtu, 08.00-16.00',
    email: null,
    googleMapsUrl: null,
  },
  {
    nama: 'MQH Tour & Travel - Magelang',
    tipe: 'representatif',
    kota: 'Magelang',
    alamat: 'Magelang, Jawa Tengah',
    telepon: null,
    whatsapp: '6285868969000',
    jamLayanan: 'Senin-Sabtu, 08.00-16.00',
    email: null,
    googleMapsUrl: null,
  },
]

export const TESTIMONI_LIST = [
  { isi: 'Pelayanan sangat memuaskan, mulai dari pendaftaran hingga kepulangan berjalan tertib dan profesional.', namaSumber: 'Jamaah Kloter 12' },
  { isi: 'Pembimbing ibadahnya sabar dan berpengalaman, jamaah lansia pun terbantu dengan baik.', namaSumber: 'Jamaah Kloter 08' },
  { isi: 'Alhamdulillah keberangkatan sesuai jadwal, hotel dekat dengan Masjidil Haram, sangat nyaman.', namaSumber: 'Jamaah Kloter 15' },
  { isi: 'Tim MQH sangat responsif menjawab pertanyaan, dari sebelum berangkat sampai selesai ibadah.', namaSumber: 'Jamaah Kloter 21' },
]
