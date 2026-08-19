import Image from 'next/image'

// Domain yang diizinkan next/image (harus sinkron dengan images.remotePatterns
// di next.config.ts). Field gambar_url di admin (paket, artikel) adalah input
// teks bebas, jadi kalau adminnya masukin URL dari domain lain, next/image
// akan throw error saat render dan bikin halaman publik crash. Makanya
// divalidasi dulu di sini — kalau domainnya tidak dikenali, tampilkan
// placeholder biasa daripada mematikan seluruh halaman.
const ALLOWED_IMAGE_HOSTS = [
  'picsum.photos',
  'images.unsplash.com',
  'plus.unsplash.com',
  'source.unsplash.com',
  'lh3.googleusercontent.com',
]
const ALLOWED_IMAGE_HOST_SUFFIXES = ['.cdninstagram.com', '.fbcdn.net', '.supabase.co', '.supabase.in']

function isAllowedImageUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url)
    if (protocol !== 'https:') return false
    if (ALLOWED_IMAGE_HOSTS.includes(hostname)) return true
    return ALLOWED_IMAGE_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  } catch {
    return false
  }
}

export default function PhotoBlock({
  imageUrl,
  alt = '',
  className = '',
  // Default cocok untuk kartu grid (1 kolom di mobile, ~1/3 lebar container
  // di desktop). Override di pemanggil untuk hero/gambar full-width atau
  // thumbnail kecil supaya next/image tidak download gambar lebih besar
  // dari yang benar-benar ditampilkan.
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  imageUrl?: string | null
  alt?: string
  className?: string
  sizes?: string
}) {
  const validUrl = imageUrl && isAllowedImageUrl(imageUrl) ? imageUrl : null

  if (validUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={validUrl} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#eee7e5] via-muted to-[#e8e1df] ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-[#c3b6ae] text-3xl">mosque</span>
      </div>
    </div>
  )
}
