import type { Metadata } from 'next'
import { getPaketBySlug, getKeberangkatanByPaketId } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PhotoBlock from '@/components/PhotoBlock'
import { formatRupiah, linkWhatsApp } from '@/lib/utils'
import { SITE_NAME } from '@/lib/config'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const paket = await getPaketBySlug(slug)
  if (!paket) return { title: `Paket Tidak Ditemukan | ${SITE_NAME}` }

  const deskripsi = paket.deskripsi || `Detail paket ${paket.nama_paket} — jadwal keberangkatan, harga, dan fasilitas.`
  return {
    title: `${paket.nama_paket} | ${SITE_NAME}`,
    description: deskripsi,
  }
}

export default async function DetailPaket({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ jadwal?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams

  const paket = await getPaketBySlug(slug)
  if (!paket) notFound()

  const semuaJadwal = await getKeberangkatanByPaketId(paket.id)
  const jadwalTerpilih = sp.jadwal
    ? semuaJadwal.find((j) => j.id === sp.jadwal) ?? semuaJadwal[0]
    : semuaJadwal[0]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <div className="pt-28 pb-16 px-5 md:px-20 max-w-[1280px] mx-auto">
        <p className="text-[12px] text-muted-foreground mb-4">
          <Link href="/" className="hover:text-secondary-hover">Beranda</Link> / <Link href="/paket" className="hover:text-secondary-hover">Paket Umroh</Link> / {paket.nama_paket}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {paket.tier && (
            <span className="bg-background border border-secondary/40 text-primary text-[11.5px] font-semibold px-3 py-1.5 rounded-full">{paket.tier}</span>
          )}
          {jadwalTerpilih?.lokasi_keberangkatan && (
            <span className="bg-background border border-secondary/40 text-primary text-[11.5px] font-semibold px-3 py-1.5 rounded-full">{jadwalTerpilih.lokasi_keberangkatan}</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-[32px] md:text-[42px] font-semibold text-primary mb-2 max-w-2xl">
              {paket.nama_paket}
            </h1>
            {paket.deskripsi && <p className="text-[14px] text-muted-foreground max-w-xl leading-relaxed">{paket.deskripsi}</p>}
          </div>
          {jadwalTerpilih && (
            <div className="text-left md:text-right shrink-0">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Mulai Dari</p>
              <p className="font-serif text-2xl font-bold text-secondary-hover">
                {formatRupiah(jadwalTerpilih.harga_promo ?? jadwalTerpilih.harga_normal)}
                <span className="text-[13px] font-normal text-muted-foreground">/pax</span>
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl overflow-hidden mb-10">
          <PhotoBlock imageUrl={paket.gambar_url} alt={paket.nama_paket} className="h-[320px] md:h-[420px] w-full" sizes="100vw" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* KIRI: info + jadwal */}
          <div className="md:col-span-2 space-y-10">
            {jadwalTerpilih && (
              <div className="flex flex-wrap gap-8 pb-8 border-b border-accent">
                {jadwalTerpilih.durasi_hari && (
                  <div>
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1 block">schedule</span>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Durasi</p>
                    <p className="text-[14px] font-semibold text-primary">{jadwalTerpilih.durasi_hari} Hari</p>
                  </div>
                )}
                {jadwalTerpilih.maskapai?.nama && (
                  <div>
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1 block">flight</span>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Maskapai</p>
                    <p className="text-[14px] font-semibold text-primary">{jadwalTerpilih.maskapai.nama}</p>
                  </div>
                )}
                {(jadwalTerpilih.hotel_mekkah?.nama || jadwalTerpilih.hotel_madinah?.nama) && (
                  <div>
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1 block">hotel</span>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Akomodasi</p>
                    <p className="text-[14px] font-semibold text-primary">
                      {[jadwalTerpilih.hotel_mekkah?.nama, jadwalTerpilih.hotel_madinah?.nama].filter(Boolean).join(' & ')}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h2 className="font-serif text-[22px] font-medium text-primary mb-5">Pilih Jadwal Keberangkatan</h2>
              <div className="space-y-3">
                {semuaJadwal.length === 0 && <p className="text-muted-foreground text-sm">Belum ada jadwal keberangkatan aktif.</p>}
                {semuaJadwal.map((j) => {
                  const aktif = jadwalTerpilih?.id === j.id
                  return (
                    <Link
                      key={j.id}
                      href={`/paket/${paket.slug}?jadwal=${j.id}`}
                      scroll={false}
                      aria-current={aktif ? 'true' : undefined}
                      className={`block bg-white rounded-xl border p-5 transition-colors hover:border-secondary-hover/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-hover ${aktif ? 'border-secondary-hover ring-1 ring-secondary-hover' : 'border-accent'}`}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[15px] text-primary flex items-center gap-2">
                            {new Date(j.tanggal_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {aktif && <span className="text-[10.5px] font-semibold text-secondary-hover bg-accent/70 px-2 py-0.5 rounded-full">Dipilih</span>}
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-1">{j.lokasi_keberangkatan}</p>
                          {j.status === 'terbatas' && <p className="text-[11.5px] text-destructive font-medium mt-1">Sisa {j.kuota_tersisa} seat</p>}
                          {j.status === 'penuh' && <p className="text-[11.5px] text-destructive font-medium mt-1">Waiting List</p>}
                        </div>
                        <div className="text-right shrink-0">
                          {j.harga_promo && <p className="text-[11.5px] text-muted-foreground line-through">{formatRupiah(j.harga_normal)}</p>}
                          <p className="font-serif text-lg font-bold text-secondary-hover">{formatRupiah(j.harga_promo ?? j.harga_normal)}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* KANAN: sticky booking card */}
          <div>
            <div className="sticky top-28 bg-white rounded-xl border border-accent p-6">
              <h3 className="font-serif text-lg font-medium text-primary mb-1">Ringkasan Biaya</h3>
              {jadwalTerpilih && (
                <p className="font-serif text-2xl font-bold text-secondary-hover mb-5">
                  {formatRupiah(jadwalTerpilih.harga_promo ?? jadwalTerpilih.harga_normal)}
                  <span className="text-[12px] font-normal text-muted-foreground"> / jamaah</span>
                </p>
              )}
              <div className="space-y-2 mb-6 text-[13px] text-muted-foreground">
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-secondary-hover">check_circle</span> Tiket Pesawat PP</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-secondary-hover">check_circle</span> Visa Umroh</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-secondary-hover">check_circle</span> Akomodasi Hotel</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-secondary-hover">check_circle</span> Muthawwif &amp; Tour Guide</p>
              </div>
              <a
                href={linkWhatsApp(paket.nama_paket, jadwalTerpilih ? new Date(jadwalTerpilih.tanggal_berangkat).toLocaleDateString('id-ID') : undefined)}
                target="_blank" rel="noopener noreferrer"
                className="block text-center bg-secondary text-primary font-bold py-3.5 rounded-full hover:bg-secondary-hover hover:text-white transition"
              >
                Pesan Sekarang
              </a>
              <p className="text-[11px] text-muted-foreground text-center mt-3">Konsultasi gratis via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
