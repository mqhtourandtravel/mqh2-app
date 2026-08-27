'use client'

import { useEffect, useState } from 'react'
import { supabase, Paket } from '@/lib/supabase'
import { adminList, adminDelete } from '@/lib/adminApi'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Search, Database, Package } from 'lucide-react'

const KATEGORI_TABS = [
  { id: 'semua', label: 'Semua Kategori' },
  { id: 'umroh', label: 'Umroh' },
  { id: 'haji', label: 'Haji' },
  { id: 'tour', label: 'Halal Tour' },
  { id: 'badal', label: 'Badal' },
]

export default function AdminListPaket() {
  const [paketList, setPaketList] = useState<Paket[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('semua')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      const data = await adminList<Paket>('paket', { orderBy: 'urutan' })
      setPaketList(data)
      setLoading(false)
    }
    init()
  }, [router])

  async function hapusPaket(id: string, nama: string) {
    if (!confirm(`Yakin hapus paket "${nama}"? Semua jadwal keberangkatan pada paket ini juga akan dihapus.`)) return
    setDeletingId(id)
    const { ok, error } = await adminDelete('paket', id)
    if (ok) {
      setPaketList((prev) => prev.filter((p) => p.id !== id))
    } else {
      alert(error ?? 'Gagal menghapus paket')
    }
    setDeletingId(null)
  }

  const filtered = paketList.filter((p) => {
    const matchSearch = (p.nama_paket ?? '').toLowerCase().includes(search.toLowerCase()) ||
                        (p.slug ?? '').toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 'semua' || p.kategori === activeTab
    return matchSearch && matchTab
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-amber-500 animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Memuat katalog paket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Package className="size-7 text-emerald-700" /> Katalog & Jadwal Paket
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Kelola daftar paket umroh, haji plus, halal tour, dan jadwal keberangkatan
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs text-gray-700 border-gray-300 hover:bg-gray-50">
            <Link href="/admin/master">
              <Database className="size-3.5" /> Master Maskapai & Hotel
            </Link>
          </Button>
          <Button asChild size="sm" className="h-9 gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm font-semibold">
            <Link href="/admin/paket/baru">
              <Plus className="size-4" /> Tambah Paket
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        {/* Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/40">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {KATEGORI_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama paket..."
              className="pl-9 h-8 text-xs bg-white border-gray-300"
            />
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/70 border-b border-gray-200/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] pl-6 text-xs font-bold text-gray-600">Foto</TableHead>
                <TableHead className="text-xs font-bold text-gray-600">Nama Paket & Tier</TableHead>
                <TableHead className="text-xs font-bold text-gray-600">Kategori</TableHead>
                <TableHead className="text-xs font-bold text-gray-600">Status</TableHead>
                <TableHead className="text-right pr-6 text-xs font-bold text-gray-600">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="size-8 text-gray-300" />
                      <p className="text-xs text-gray-500 font-medium">Tidak ada paket yang sesuai pencarian.</p>
                      {search && (
                        <Button variant="ghost" size="sm" onClick={() => setSearch('')} className="text-xs text-emerald-700">
                          Reset Pencarian
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-emerald-50/20 transition-colors">
                    <TableCell className="pl-6 py-3">
                      <div className="size-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative shrink-0">
                        {p.gambar_url ? (
                          <Image src={p.gambar_url} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="size-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <Link href={`/admin/paket/${p.id}`} className="text-xs font-bold text-gray-900 hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                          {p.nama_paket}
                          {p.tier && (
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              {p.tier}
                            </span>
                          )}
                        </Link>
                        <p className="text-[11px] text-gray-400 font-mono">/paket/{p.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 uppercase tracking-wider">
                        {p.kategori}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        p.status === 'aktif'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        <span className={`size-1.5 rounded-full ${p.status === 'aktif' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {p.status === 'aktif' ? 'Tampil Publik' : 'Disembunyikan'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-3 space-x-1.5">
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs border-gray-200 text-emerald-700 hover:bg-emerald-50 gap-1 rounded-lg">
                        <Link href={`/admin/paket/${p.id}`}>
                          <Pencil className="size-3.5" /> Edit & Jadwal
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === p.id}
                        onClick={() => hapusPaket(p.id, p.nama_paket)}
                        className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
