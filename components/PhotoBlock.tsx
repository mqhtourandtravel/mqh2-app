'use client'

import Image from 'next/image'

// Fallback bergilir agar placeholder DB kosong tidak monoton
const FALLBACKS = [
  '/images/mosque-night.jpg',
  '/images/kaaba-closeup.jpg',
  '/images/madinah-mosque.jpg',
  '/images/hotel-luxury.jpg',
]

function pickFallback(seed?: string): string {
  if (!seed) return FALLBACKS[0]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return FALLBACKS[h % FALLBACKS.length]
}

export default function PhotoBlock({ 
  className = '', 
  imageUrl, 
  alt = '',
  sizes,
  priority,
}: { 
  className?: string
  imageUrl?: string | null
  alt?: string
  sizes?: string
  priority?: boolean
}) {
  const src = imageUrl || pickFallback(alt)
  return (
    <div 
      className={`relative overflow-hidden bg-muted ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes ?? "100vw"}
      />
    </div>
  )
}