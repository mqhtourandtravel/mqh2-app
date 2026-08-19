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

const NAMA_BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const LABEL_KATEGORI: Record<string, string> = {
  umroh: 'Paket Umroh',
  haji: 'Paket Haji',
  tour: 'Halal Tour',
  badal: 'Badal Umroh',
}

export default function PaketFilterBar({
  semuaTier,
  semuaLokasi,
  semuaDurasi,
  semuaKategori,
}: {
  semuaTier: string[]
  semuaLokasi: string[]
  semuaDurasi: number[]
  semuaKategori: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== '_semua') params.set(key, value)
    else params.delete(key)
    router.push(`/paket?${params.toString()}`)
  }

  return (
    <div className="glass-panel rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      <div>
        <Label htmlFor="filter-kategori" className="mb-2">Kategori</Label>
        <Select value={searchParams.get('kategori') ?? '_semua'} onValueChange={(v) => updateFilter('kategori', v)}>
          <SelectTrigger id="filter-kategori"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_semua">Semua Kategori</SelectItem>
            {semuaKategori.map((kategori) => (
              <SelectItem key={kategori} value={kategori}>{LABEL_KATEGORI[kategori] ?? kategori}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-bulan" className="mb-2">Bulan Keberangkatan</Label>
        <Select value={searchParams.get('bulan') ?? '_semua'} onValueChange={(v) => updateFilter('bulan', v)}>
          <SelectTrigger id="filter-bulan"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_semua">Semua Bulan</SelectItem>
            {NAMA_BULAN.map((nama, i) => (
              <SelectItem key={i} value={String(i + 1)}>{nama}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-tier" className="mb-2">Jenis Paket</Label>
        <Select value={searchParams.get('tier') ?? '_semua'} onValueChange={(v) => updateFilter('tier', v)}>
          <SelectTrigger id="filter-tier"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_semua">Semua Paket</SelectItem>
            {semuaTier.map((tier) => (
              <SelectItem key={tier} value={tier}>{tier}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-durasi" className="mb-2">Durasi</Label>
        <Select value={searchParams.get('durasi') ?? '_semua'} onValueChange={(v) => updateFilter('durasi', v)}>
          <SelectTrigger id="filter-durasi"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_semua">Semua Durasi</SelectItem>
            {semuaDurasi.map((d) => (
              <SelectItem key={d} value={String(d)}>{d} Hari</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-lokasi" className="mb-2">Lokasi Keberangkatan</Label>
        <Select value={searchParams.get('lokasi') ?? '_semua'} onValueChange={(v) => updateFilter('lokasi', v)}>
          <SelectTrigger id="filter-lokasi"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_semua">Semua Lokasi</SelectItem>
            {semuaLokasi.map((lokasi) => (
              <SelectItem key={lokasi} value={lokasi}>{lokasi}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {searchParams.toString() && (
        <Button
          variant="link"
          onClick={() => router.push('/paket')}
          className="md:col-span-5 h-auto p-0 justify-end text-[12.5px] font-semibold text-secondary-hover no-underline hover:underline"
        >
          Reset Filter
        </Button>
      )}
    </div>
  )
}
