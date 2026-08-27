'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { adminList, agentAssignJamaah } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserCheck, UserX, Users, CheckCircle2, UserPlus } from 'lucide-react'

export default function AdminAgents() {
  const router = useRouter()
  const [agents, setAgents] = useState<User[]>([])
  const [jamaahList, setJamaahList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      muatSemua()
    }
    init()
  }, [router])

  async function muatSemua() {
    setLoading(true)
    const allUsers = await adminList<User>('user', { orderBy: 'created_at', dir: 'desc' })
    setAgents(allUsers.filter((u) => u.role === 'agen'))
    setJamaahList(allUsers.filter((u) => u.role === 'jamaah'))
    setLoading(false)
  }

  async function handleAssign(jamaahId: string, agenId: string) {
    setError('')
    setSuccess('')
    const { error: err } = await agentAssignJamaah(jamaahId, agenId || null)
    if (err) {
      setError(err)
      return
    }
    setSuccess('Berhasil menetapkan jamaah ke agen.')
    muatSemua()
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleUnassign(jamaahId: string) {
    setError('')
    setSuccess('')
    const { error: err } = await agentAssignJamaah(jamaahId, null)
    if (err) {
      setError(err)
      return
    }
    setSuccess('Berhasil melepas jamaah dari agen.')
    muatSemua()
    setTimeout(() => setSuccess(''), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-amber-500 animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Memuat data agen & jamaah...</p>
        </div>
      </div>
    )
  }

  // Group jamaah by agent
  const jamaahByAgen = new Map<string, User[]>()
  const unassigned: User[] = []
  for (const j of jamaahList) {
    if (j.agen_id) {
      const list = jamaahByAgen.get(j.agen_id) ?? []
      list.push(j)
      jamaahByAgen.set(j.agen_id, list)
    } else {
      unassigned.push(j)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="size-7 text-emerald-700" /> Manajemen Agen & Jamaah Binaan
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Pantau agen resmi dan distribusikan calon jamaah yang mendaftar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="soft" className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200">
            {agents.length} Agen Aktif
          </Badge>
          <Badge variant="soft" className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
            {jamaahList.length} Total Jamaah
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700 text-xs">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <AlertDescription className="font-medium">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Agents + their jamaah */}
        <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50/70 to-transparent border-b border-gray-100 p-5">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UserCheck className="size-5 text-blue-700" /> Daftar Agen & Jamaah Binaan
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Agen yang membimbing jamaah dalam booking dan persiapan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {agents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="size-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">Belum ada user dengan role Agen.</p>
                <p className="text-[11px] text-gray-400 mt-1">Ubah role pengguna menjadi "Agen" di menu Kelola Pengguna.</p>
              </div>
            ) : (
              agents.map((agen) => {
                const binaan = jamaahByAgen.get(agen.id) ?? []
                return (
                  <div key={agen.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                          {(agen.nama ?? agen.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{agen.nama ?? 'Agen Tanpa Nama'}</p>
                          <p className="text-[11px] text-gray-400 font-mono">{agen.email}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {binaan.length} Jamaah
                      </span>
                    </div>

                    {binaan.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Jamaah Terbina:</p>
                        {binaan.map((j) => (
                          <div key={j.id} className="flex items-center justify-between text-xs bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-xs">
                            <span className="font-medium text-gray-800">{j.nama ?? j.email}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 text-red-400 hover:bg-red-50 hover:text-red-600 rounded"
                              onClick={() => handleUnassign(j.id)}
                              title="Lepas jamaah"
                            >
                              <UserX className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">Belum ada jamaah binaan.</p>
                    )}
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Right Column: Unassigned jamaah */}
        <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-amber-50/70 to-transparent border-b border-gray-100 p-5">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="size-5 text-amber-700" /> Jamaah Belum Diassign ({unassigned.length})
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Calon jamaah yang belum terhubung dengan agen pendamping
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {unassigned.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="size-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 font-semibold">Semua jamaah sudah memiliki agen pembimbing!</p>
              </div>
            ) : (
              unassigned.map((j) => (
                <div key={j.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{j.nama ?? 'Nama belum diset'}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{j.email}</p>
                  </div>
                  <Select onValueChange={(v) => handleAssign(j.id, v)}>
                    <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs bg-white border-gray-300">
                      <SelectValue placeholder="Pilih Agen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((a) => (
                        <SelectItem key={a.id} value={a.id} className="text-xs">
                          {a.nama ?? a.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
