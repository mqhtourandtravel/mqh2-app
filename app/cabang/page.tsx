import type { Metadata } from 'next'
import { CABANG_LIST } from '@/lib/config'
import SiteHeader from '@/components/SiteHeader'
import PageHero from '@/components/PageHero'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/config'
import { Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: `Cabang & Kantor Layanan | ${SITE_NAME}`,
  description: 'Daftar kantor pusat dan cabang representatif MQH Tour & Travel untuk konsultasi langsung.',
}

export default async function HalamanCabang({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string }>
}) {
  const { tipe } = await searchParams
  const cabangList = CABANG_LIST
  const pusat = tipe && tipe !== 'pusat' ? [] : cabangList.filter((c) => c.tipe === 'pusat')
  const representatif = tipe && tipe !== 'representatif' ? [] : cabangList.filter((c) => c.tipe === 'representatif')

  function KartuCabang({ c }: { c: (typeof CABANG_LIST)[number] }) {
    return (
      <div className="bg-white rounded-xl border border-accent p-6 hover:shadow-[var(--shadow-md-custom)] transition-shadow">
        <h3 className="font-serif text-lg font-medium text-primary mb-1">{c.nama}</h3>
        <p className="text-[12.5px] text-muted-foreground mb-4">{c.kota}</p>
        {c.alamat && (
          <p className="text-[13.5px] text-muted-foreground flex items-start gap-2 mb-2">
            <MapPin className="text-[16px] text-secondary mt-0.5" aria-hidden="true" />
            {c.alamat}
          </p>
        )}
        {c.jamLayanan && (
          <p className="text-[13px] text-muted-foreground flex items-center gap-2 mb-4">
            <Clock className="text-[16px] text-secondary" aria-hidden="true" />
            {c.jamLayanan}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-[13px] font-semibold pt-2 border-t border-accent">
          {c.whatsapp && (
            <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-secondary-hover hover:underline pt-2">Chat WhatsApp</a>
          )}
          {c.googleMapsUrl && (
            <a href={c.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline pt-2">Lihat di Maps</a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <PageHero title="Cabang & Kantor Layanan" breadcrumb="Cabang" desc="Kunjungi kantor kami untuk konsultasi langsung dengan tim MQH Tour & Travel" />
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
        {tipe && (
          <div className="flex items-center gap-3 mb-8 text-[12.5px]">
            <span className="text-muted-foreground">
              Menampilkan: <span className="font-semibold text-primary">{tipe === 'pusat' ? 'Kantor Pusat' : 'Cabang Representatif'}</span>
            </span>
            <Link href="/cabang" className="font-semibold text-secondary-hover hover:underline">Lihat Semua Cabang</Link>
          </div>
        )}
        {pusat.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-secondary-hover mb-5">Kantor Pusat</h2>
            <div className="grid md:grid-cols-2 gap-5">{pusat.map((c, i) => <KartuCabang key={i} c={c} />)}</div>
          </div>
        )}
        {representatif.length > 0 && (
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-secondary-hover mb-5">Cabang Representatif</h2>
            <div className="grid md:grid-cols-2 gap-5">{representatif.map((c, i) => <KartuCabang key={i} c={c} />)}</div>
          </div>
        )}
        {cabangList.length === 0 && <p className="text-muted-foreground text-sm text-center py-12">Belum ada data cabang.</p>}
        {cabangList.length > 0 && pusat.length === 0 && representatif.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-12">Belum ada data untuk kategori ini.</p>
        )}
      </div>
</div>
  )
}
