import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Halaman 404 branded -- dipakai otomatis oleh notFound() di route dinamis
// (/paket/[slug], /artikel/[slug]) dan URL yang tidak dikenal.
export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <p className="font-serif text-[64px] md:text-[80px] font-bold text-primary leading-none mb-2">404</p>
      <h1 className="font-serif text-[22px] md:text-[26px] font-semibold text-primary mb-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-[14px] text-muted-foreground max-w-md leading-relaxed mb-8">
        Maaf, halaman atau paket yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="secondary">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild variant="outline" className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground">
          <Link href="/paket">Lihat Paket Umroh</Link>
        </Button>
      </div>
    </main>
  )
}
