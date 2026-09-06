import Link from 'next/link'
import React from 'react'
import { Keberangkatan } from '@/lib/supabase'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import PaketTableRow from '@/components/PaketTableRow'
import PaketTableFilterBar from '@/components/PaketTableFilterBar'

// ─── Grouping per bulan ─────────────────────────────────────────────────────
function groupByBulan(data: Keberangkatan[]): { label: string; items: Keberangkatan[] }[] {
  const map = new Map<string, Keberangkatan[]>()
  for (const k of data) {
    const label = new Date(k.tanggal_berangkat).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })
    const group = map.get(label)
    if (group) group.push(k)
    else map.set(label, [k])
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

// Total columns (superset of mobile + desktop for colSpan):
// Mobile:  [Nama Paket] [Keberangkatan] [Harga] [Toggle ≡]           = 4 visible
// Desktop: [Nama Paket] [Keberangkatan] [Maskapai] [Hotel] [Harga] [Aksi] = 6 visible
// Header row has 7 <th> total (Aksi col is hidden md:table-cell, Toggle col is md:hidden)
const TOTAL_COLS = 7

// ─── Main Component (Server) ────────────────────────────────────────────────
export default function PaketTable({
  data,
  hasFilter = false,
  filterOptions,
}: {
  data: Keberangkatan[]
  hasFilter?: boolean
  filterOptions: {
    semuaLokasi: string[]
    semuaDurasi: number[]
  }
}) {
  const emptyState = (
    <div className="p-10 text-center">
      <p className="text-muted-foreground text-sm mb-4">
        Tidak ada jadwal keberangkatan yang cocok dengan filter yang dipilih.
      </p>
      {hasFilter && (
        <Button asChild variant="outline" size="sm" className="rounded">
          <Link href="/#paket">Reset Filter</Link>
        </Button>
      )}
    </div>
  )

  const grouped = data.length > 0 ? groupByBulan(data) : []

  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-none border border-white/40">
      {/* ── Filter Bar: Client Component embedded at top of container ─────── */}
      <PaketTableFilterBar
        semuaLokasi={filterOptions.semuaLokasi}
        semuaDurasi={filterOptions.semuaDurasi}
      />

      {data.length === 0 ? emptyState : (
        /* ── Responsive Table ───────────────────────────────────────────── */
        /* Mobile: table-fixed, no scroll, explicit widths on th & td       */
        /* Desktop: md:overflow-x-auto md:table-auto                       */
        <div className="md:overflow-x-auto w-full">
          <Table className="w-full table-fixed md:table-auto">
            <TableHeader>
              <TableRow className="border-white/60 hover:bg-transparent">
                {/* 1. Nama Paket — 30% di mobile, auto di desktop */}
                <TableHead className="w-[30%] md:w-auto pl-3 md:pl-6 whitespace-normal overflow-hidden">
                  Nama Paket
                </TableHead>

                {/* 2. Keberangkatan — 30% di mobile, auto di desktop */}
                <TableHead className="w-[30%] md:w-auto whitespace-nowrap overflow-hidden">
                  Keberangkatan
                </TableHead>

                {/* 3. Maskapai — desktop only */}
                <TableHead className="hidden md:table-cell whitespace-nowrap">
                  Maskapai
                </TableHead>

                {/* 4. Hotel — desktop only */}
                <TableHead className="hidden md:table-cell whitespace-nowrap">
                  Hotel
                </TableHead>

                {/* 5. Harga — 30% di mobile, auto di desktop */}
                <TableHead className="w-[30%] md:w-auto text-right whitespace-nowrap overflow-hidden">
                  Harga
                </TableHead>

                {/* 6. Aksi — desktop only */}
                <TableHead className="hidden md:table-cell text-center pr-6 whitespace-nowrap">
                  Aksi
                </TableHead>
                {/* 7. Toggle icon — mobile only */}
                <TableHead className="md:hidden w-10 px-1 text-center" aria-label="Detail" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {grouped.map(({ label, items }) => (
                <React.Fragment key={label}>
                  {/* ── Month separator row ──────────────────────────────── */}
                  <TableRow className="bg-primary/5 border-y border-primary/20 hover:bg-primary/5">
                    <TableCell
                      colSpan={TOTAL_COLS}
                      className="py-2 pl-3 md:pl-6 text-[10px] font-bold uppercase tracking-widest text-secondary"
                    >
                      {label}
                    </TableCell>
                  </TableRow>

                  {/* ── Data rows: Client Component for interactivity ─────── */}
                  {items.map((k) => (
                    <PaketTableRow key={k.id} k={k} />
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
