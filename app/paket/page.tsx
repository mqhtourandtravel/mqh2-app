import type { Metadata } from 'next'
import { getKeberangkatanAktif } from '@/lib/queries'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'
import PaketFilterBar from '@/components/PaketFilterBar'
import PaketCard from '@/components/PaketCard'
import { SITE_NAME } from '@/lib/config'

export const revalidate = 60

export const metadata: Metadata = {
  title: `Paket Umroh Terbaik | ${SITE_NAME}`,
  description: 'Pilih paket umroh sesuai kebutuhan Anda — berbagai tier, jadwal keberangkatan, dan fasilitas terbaik untuk kenyamanan ibadah.',
}

export default async function KatalogPaket({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tier?: string; lokasi?: string; durasi?: string; kategori?: string }>
}) {
  const sp = await searchParams

  // Ambil daftar TANPA filter lokasi/durasi dulu, supaya opsi di dropdown
  // filter (semuaTier, semuaLokasi, dst.) selalu lengkap dan tidak ikut
  // menyempit begitu salah satu filter lain dipilih. Semua penyaringan
  // (termasuk lokasi & durasi) dilakukan di satu tempat lewat `filtered`.
  const keberangkatanList = await getKeberangkatanAktif()

  const filtered = keberangkatanList.filter((k) => {
    if (sp.bulan && new Date(k.tanggal_berangkat).getMonth() + 1 !== Number(sp.bulan)) return false
    if (sp.tier && k.paket?.tier !== sp.tier) return false
    if (sp.kategori && k.paket?.kategori !== sp.kategori) return false
    if (sp.lokasi && k.lokasi_keberangkatan !== sp.lokasi) return false
    if (sp.durasi && k.durasi_hari !== Number(sp.durasi)) return false
    return true
  })

  const semuaTier = Array.from(new Set(keberangkatanList.map(k => k.paket?.tier).filter(Boolean))) as string[]
  const semuaLokasi = Array.from(new Set(keberangkatanList.map(k => k.lokasi_keberangkatan).filter(Boolean))) as string[]
  const semuaDurasi = Array.from(new Set(keberangkatanList.map(k => k.durasi_hari).filter(Boolean))).sort((a, b) => (a as number) - (b as number)) as number[]
  const semuaKategori = Array.from(new Set(keberangkatanList.map(k => k.paket?.kategori).filter(Boolean))) as string[]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <PageHero
        title="Paket Umroh Terbaik"
        breadcrumb="Paket"
        desc="Pilih paket umroh yang sesuai dengan kebutuhan Anda. Kami menyediakan berbagai pilihan paket dengan fasilitas terbaik untuk kenyamanan ibadah Anda."
      />

      <div className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
        <PaketFilterBar semuaTier={semuaTier} semuaLokasi={semuaLokasi} semuaDurasi={semuaDurasi} semuaKategori={semuaKategori} />
        <p className="text-[12.5px] text-muted-foreground mb-5">{filtered.length} paket ditemukan</p>
        <div className="space-y-5">
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm py-12 text-center">Tidak ada paket yang cocok dengan filter ini.</p>
          )}
          {filtered.map((k) => <PaketCard key={k.id} k={k} />)}
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
