'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default function PaketTableFilterBar({
  semuaLokasi,
  semuaDurasi,
}: {
  semuaLokasi: string[]
  semuaDurasi: number[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentBulan = searchParams.get('bulan') ?? '_semua'
  const currentLokasi = searchParams.get('lokasi') ?? '_semua'
  const currentDurasi = searchParams.get('durasi') ?? '_semua'

  const hasActiveFilter = Boolean(
    searchParams.get('bulan') || searchParams.get('lokasi') || searchParams.get('durasi')
  )

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== '_semua') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const query = params.toString()
    router.push(query ? `/?${query}#paket` : '/#paket', { scroll: false })
  }

  function resetFilter() {
    router.push('/#paket', { scroll: false })
  }

  return (
    <div className="p-2 sm:p-3 md:p-5 border-b border-white/30">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 items-center">
        {/* Filter Bulan */}
        <div>
          <Label htmlFor="tbl-filter-bulan" className="sr-only">
            Bulan Keberangkatan
          </Label>
          <Select value={currentBulan} onValueChange={(v) => updateFilter('bulan', v)}>
            <SelectTrigger id="tbl-filter-bulan" className="bg-white/80 border-white/60">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_semua">Semua</SelectItem>
              {NAMA_BULAN.map((nama, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Lokasi */}
        <div>
          <Label htmlFor="tbl-filter-lokasi" className="sr-only">
            Kota Keberangkatan
          </Label>
          <Select value={currentLokasi} onValueChange={(v) => updateFilter('lokasi', v)}>
            <SelectTrigger id="tbl-filter-lokasi" className="bg-white/80 border-white/60">
              <SelectValue placeholder="Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_semua">Semua</SelectItem>
              {semuaLokasi.map((lokasi) => (
                <SelectItem key={lokasi} value={lokasi}>
                  {lokasi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Durasi */}
        <div>
          <Label htmlFor="tbl-filter-durasi" className="sr-only">
            Durasi Perjalanan
          </Label>
          <Select value={currentDurasi} onValueChange={(v) => updateFilter('durasi', v)}>
            <SelectTrigger id="tbl-filter-durasi" className="bg-white/80 border-white/60">
              <SelectValue placeholder="Semua Durasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_semua">Semua Durasi</SelectItem>
              {semuaDurasi.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} Hari
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilter && (
        <div className="mt-3 pt-3 border-t border-white/20 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilter}
            className="text-[12px] text-muted-foreground hover:text-secondary-hover gap-1.5 h-7 px-2"
          >
            <RotateCcw className="size-3" />
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  )
}
