import Link from 'next/link'
import { Keberangkatan } from '@/lib/supabase'
import PhotoBlock from '@/components/PhotoBlock'
import { formatRupiah } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function PaketCard({ k }: { k: Keberangkatan }) {
  return (
    <Card className="group overflow-hidden shadow-[0_4px_20px_rgba(60,42,33,0.03)] hover:shadow-[0_8px_30px_rgba(60,42,33,0.08)] transition-shadow duration-300 md:flex-row p-4 md:p-6 gap-6 items-start md:items-center bg-card border-accent/50">
      <div className="w-full md:w-56 h-40 rounded-lg overflow-hidden shrink-0 relative">
        {k.durasi_hari && (
          <Badge variant="soft" className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm border border-secondary/30 normal-case tracking-normal font-semibold">
            {k.durasi_hari} Hari
          </Badge>
        )}
        <PhotoBlock imageUrl={k.paket?.gambar_url} alt={k.paket?.nama_paket ?? ''} className="w-full h-full group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 224px" />
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        <div className="md:col-span-5">
          <h3 className="font-serif text-xl font-medium text-primary mb-2">{k.paket?.nama_paket}</h3>
          <div className="flex flex-col gap-1.5 mt-2">
            <p className="text-[13px] text-muted-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">calendar_month</span>
              {new Date(k.tanggal_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {k.maskapai?.nama && (
              <p className="text-[13px] text-muted-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">flight</span>
                {k.maskapai.nama}
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-accent md:pl-6">
          <div>
            <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider mb-1 font-bold">Hotel Makkah</p>
            <p className="text-[13.5px] text-primary font-medium">{k.hotel_mekkah?.nama ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider mb-1 font-bold">Hotel Madinah</p>
            <p className="text-[13.5px] text-primary font-medium">{k.hotel_madinah?.nama ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-accent pt-4 md:pt-0 md:pl-6 min-w-[180px]">
        <div className="text-left md:text-right w-full">
          {k.harga_promo && (
            <p className="text-[12.5px] text-muted-foreground line-through mb-0.5">{formatRupiah(k.harga_normal)}</p>
          )}
          <p className="font-serif text-xl font-bold text-primary whitespace-nowrap">
            {formatRupiah(k.harga_promo ?? k.harga_normal)}
          </p>
          {k.status === 'terbatas' && (
            <p className="text-[11px] text-destructive font-medium mt-1">Sisa {k.kuota_tersisa} seat</p>
          )}
          {k.status === 'penuh' && (
            <p className="text-[11px] text-destructive font-medium mt-1">Waiting List</p>
          )}
        </div>
        <Button asChild variant="secondary" className="shadow-sm mt-3 md:mt-4">
          <Link href={`/paket/${k.paket?.slug}?jadwal=${k.id}`}>
            Detail
          </Link>
        </Button>
      </div>
    </Card>
  )
}
