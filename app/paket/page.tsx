import { getKeberangkatanAktif } from '@/lib/queries'
import SiteHeader from '@/components/SiteHeader'
import PaketFilterBar from '@/components/PaketFilterBar'
import PaketCard from '@/components/PaketCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/config'

export const revalidate = 60

export const metadata: Metadata = {
  title: `Paket & Jadwal Keberangkatan | ${SITE_NAME}`,
  description:
    'Daftar lengkap paket umroh & haji MQH Tour & Travel beserta jadwal keberangkatan, harga per pax, hotel Makkah & Madinah, dan sisa kuota seat.',
}

export default async function KatalogPaket({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tier?: string; lokasi?: string; durasi?: string; kategori?: string }>
}) {
  const sp = await searchParams

  const keberangkatanList = await getKeberangkatanAktif({
    lokasi: sp.lokasi,
    durasiHari: sp.durasi ? Number(sp.durasi) : undefined,
  })

  const filtered = keberangkatanList.filter((k) => {
    if (sp.bulan && new Date(k.tanggal_berangkat).getMonth() + 1 !== Number(sp.bulan)) return false
    if (sp.tier && k.paket?.tier !== sp.tier) return false
    if (sp.kategori && k.paket?.kategori !== sp.kategori) return false
    return true
  })

  const semuaTier = Array.from(new Set(keberangkatanList.map(k => k.paket?.tier).filter(Boolean))) as string[]
  const semuaLokasi = Array.from(new Set(keberangkatanList.map(k => k.lokasi_keberangkatan).filter(Boolean))) as string[]
  const semuaDurasi = Array.from(new Set(keberangkatanList.map(k => k.durasi_hari).filter(Boolean))).sort((a, b) => (a as number) - (b as number)) as number[]
  const semuaKategori = Array.from(new Set(keberangkatanList.map(k => k.paket?.kategori).filter(Boolean))) as string[]

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SiteHeader />
      <div className="pt-40 pb-6 px-5 md:px-20 max-w-[1280px] mx-auto text-center">
        <p className="text-[12px] text-[var(--muted-foreground)] mb-2">
          <Link href="/" className="hover:text-[var(--secondary-hover)]">Beranda</Link> / Paket
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[36px] md:text-[48px] font-semibold text-[var(--foreground)] mb-3">
          Paket Umroh Terbaik
        </h1>
        <p className="text-[14.5px] text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
          Pilih paket umroh yang sesuai dengan kebutuhan Anda. Kami menyediakan berbagai pilihan paket dengan fasilitas terbaik untuk kenyamanan ibadah Anda.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
        <PaketFilterBar 
          semuaTier={semuaTier} 
          semuaLokasi={semuaLokasi} 
          semuaDurasi={semuaDurasi} 
          semuaKategori={semuaKategori} 
        />
        <p className="text-[12.5px] text-[var(--muted-foreground)] mb-5">{filtered.length} paket ditemukan</p>
        <div className="space-y-5">
          {filtered.length === 0 && (
            <p className="text-[var(--muted-foreground)] text-sm py-12 text-center">Tidak ada paket yang cocok dengan filter ini.</p>
          )}
          {filtered.map((k) => <PaketCard key={k.id} k={k} />)}
        </div>
      </div>
</div>
  )
}