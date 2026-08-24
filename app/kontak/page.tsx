import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import PageHero from '@/components/PageHero'
import { getCabangAktif } from '@/lib/queries'
import { waLink } from '@/lib/utils'
import { SITE_NAME } from '@/lib/config'
import { Clock, MapPin } from 'lucide-react'

export const revalidate = 60

export const metadata: Metadata = {
  title: `Hubungi Kami | ${SITE_NAME}`,
  description: 'Hubungi kantor pusat MQH Tour & Travel untuk konsultasi paket umroh dan haji.',
}

export default async function KontakPage() {
  const cabangList = await getCabangAktif()
  // Pakai data cabang bertipe "pusat" yang sama dengan yang tampil di /cabang,
  // jadi alamat kantor pusat tidak lagi hardcode dan otomatis sinkron kalau
  // diubah dari admin.
  const pusat = cabangList.find((c) => c.tipe === 'pusat')

  const alamat = pusat?.alamat || pusat?.kota || 'Alamat kantor pusat belum tersedia'
  const jamLayanan = pusat?.jam_layanan || 'Senin – Sabtu, 08.00 – 16.00 WIB'
  const nomorWaKontak = pusat?.whatsapp

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <PageHero title="Hubungi Kami" breadcrumb="Contact" />
      <div className="max-w-[820px] mx-auto px-5 md:px-20 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-accent p-7">
            <MapPin className="text-secondary text-3xl mb-3 block" aria-hidden="true" />
            <h3 className="font-serif text-lg font-medium text-primary mb-2">
              {pusat?.nama || 'Kantor Pusat'}
            </h3>
            <p className="text-[13.5px] text-muted-foreground mb-5">{alamat}</p>
            <a
              href={nomorWaKontak ? `https://wa.me/${nomorWaKontak}` : waLink('Assalamualaikum, saya ingin bertanya tentang layanan MQH Tour & Travel')}
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-secondary text-primary text-[13px] font-semibold px-6 py-3 rounded-full hover:bg-secondary-hover hover:text-white transition"
            >
              Chat WhatsApp
            </a>
          </div>
          <div className="bg-white rounded-xl border border-accent p-7">
            <Clock className="text-secondary text-3xl mb-3 block" aria-hidden="true" />
            <h3 className="font-serif text-lg font-medium text-primary mb-2">Jam Layanan</h3>
            <p className="text-[13.5px] text-muted-foreground">{jamLayanan}</p>
          </div>
        </div>
      </div>
</div>
  )
}
