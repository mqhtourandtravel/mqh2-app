'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { agentListJamaah } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Users, Phone, Mail, MessageSquare, Search, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react'

export default function AgentDashboard() {
  const router = useRouter()
  const [jamaahList, setJamaahList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      setUserName(session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'Agen')
      muatJamaah()
    }
    init()
  }, [router])

  async function muatJamaah(q?: string) {
    setLoading(true)
    const data = await agentListJamaah<User>({ search: q })
    setJamaahList(data)
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    muatJamaah(search)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-amber-500 animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Memuat data portal agen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c2417] via-[#123623] to-[#1a4a31] p-6 md:p-8 text-white shadow-xl border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 size-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md mb-1 border border-white/10">
              <Sparkles className="size-3 text-amber-400" />
              <span>Portal Kemitraan Resmi MQH</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              Selamat Bertugas, <span className="text-amber-300">{userName}</span>
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/70">
              Pantau dan dampingi calon jamaah binaan Anda menuju tanah suci
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-[#0c2417] font-semibold shadow-md gap-1.5 h-9 rounded-lg">
              <a href="https://wa.me/6285868969000" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="size-4" /> Bantuan Admin Pusat
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border border-gray-200/80 shadow-sm rounded-xl p-5 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Jamaah Binaan</p>
            <p className="text-3xl font-bold font-serif text-gray-900">{jamaahList.length}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Calon Jamaah Terdaftar</p>
          </div>
          <div className="size-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-inner">
            <Users className="size-6" />
          </div>
        </Card>

        <Card className="border border-gray-200/80 shadow-sm rounded-xl p-5 bg-white flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Status Kemitraan</p>
            <p className="text-xl font-bold font-serif text-emerald-700">Agen Aktif</p>
            <p className="text-[11px] text-gray-400">Terverifikasi Resmi</p>
          </div>
          <div className="size-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-inner">
            <ShieldCheck className="size-6" />
          </div>
        </Card>

        <Card className="border border-gray-200/80 shadow-sm rounded-xl p-5 bg-white flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Katalog Paket</p>
            <p className="text-sm font-semibold text-gray-800">Paket Siap Ditawarkan</p>
            <a href="/paket" target="_blank" className="text-xs text-amber-700 font-semibold hover:underline inline-flex items-center gap-1">
              Buka Katalog <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="size-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-inner">
            <Sparkles className="size-6" />
          </div>
        </Card>
      </div>

      {/* Jamaah List Card */}
      <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/40">
          <div>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Users className="size-5 text-emerald-700" /> Daftar Jamaah Binaan
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Jamaah yang diassign langsung di bawah pendampingan Anda
            </CardDescription>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-72">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="pl-9 h-8 text-xs bg-white border-gray-300"
              />
            </div>
            <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
              Cari
            </Button>
          </form>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-gray-100">
          {jamaahList.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              <Users className="size-8 mx-auto mb-2 text-gray-300" />
              {search ? 'Tidak ada jamaah yang cocok dengan pencarian.' : 'Belum ada jamaah binaan yang diassign.'}
            </div>
          ) : (
            jamaahList.map((j) => {
              const waClean = j.no_whatsapp?.replace(/[^0-9]/g, '')
              const waUrl = waClean
                ? `https://wa.me/${waClean.startsWith('0') ? '62' + waClean.slice(1) : waClean}?text=${encodeURIComponent(`Assalamu'alaikum Bapak/Ibu ${j.nama ?? ''}, saya dari MQH Tour & Travel...`)}`
                : null

              return (
                <div key={j.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/20 transition-colors">
                  <div className="flex items-center gap-3.5">
                    {j.photo_url ? (
                      <Image
                        src={j.photo_url}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                        {(j.nama ?? j.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900 text-xs">
                        {j.nama ?? <span className="italic text-gray-400">Nama belum diset</span>}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="size-3 text-gray-400" /> {j.email}
                        </span>
                        {j.no_whatsapp && (
                          <span className="flex items-center gap-1 font-mono text-emerald-700">
                            <Phone className="size-3 text-emerald-600" /> {j.no_whatsapp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {waUrl && (
                      <Button asChild size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg font-semibold shadow-xs">
                        <a href={waUrl} target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="size-3.5" /> Chat WhatsApp
                        </a>
                      </Button>
                    )}
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      Jamaah
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
