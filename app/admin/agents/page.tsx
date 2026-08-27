'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { adminList, agentAssignJamaah } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { UserCheck, UserX } from 'lucide-react'

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
    setSuccess('Berhasil assign jamaah.')
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
    setSuccess('Berhasil unassign jamaah.')
    muatSemua()
    setTimeout(() => setSuccess(''), 3000)
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

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
    <AdminShell>
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <h1 className="text-2xl font-serif font-bold text-primary mb-8">Kelola Agen & Jamaah</h1>

        {error && (
          <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/20">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Agents + their jamaah */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="size-5" /> Agen ({agents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada agen terdaftar.</p>
              ) : (
                agents.map((agen) => {
                  const binaan = jamaahByAgen.get(agen.id) ?? []
                  return (
                    <div key={agen.id} className="border-b border-accent pb-3 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-primary text-[13.5px]">{agen.nama ?? agen.email}</p>
                          <p className="text-[11px] text-muted-foreground">{agen.email}</p>
                        </div>
                        <Badge variant="soft">{binaan.length} jamaah</Badge>
                      </div>
                      {binaan.length > 0 && (
                        <div className="space-y-1.5 ml-2">
                          {binaan.map((j) => (
                            <div key={j.id} className="flex items-center justify-between text-[12px] bg-muted/50 rounded px-3 py-1.5">
                              <span>{j.nama ?? j.email}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleUnassign(j.id)}
                              >
                                <UserX className="size-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Unassigned jamaah */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jamaah Belum Diassign ({unassigned.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {unassigned.length === 0 ? (
                <p className="text-sm text-muted-foreground">Semua jamaah sudah diassign.</p>
              ) : (
                unassigned.map((j) => (
                  <div key={j.id} className="flex items-center justify-between text-[13px] border-b border-accent pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-primary">{j.nama ?? <span className="italic text-muted-foreground">-</span>}</p>
                      <p className="text-[11px] text-muted-foreground">{j.email}</p>
                    </div>
                    <Select onValueChange={(v) => handleAssign(j.id, v)}>
                      <SelectTrigger className="w-[140px] h-8 text-[12px]">
                        <SelectValue placeholder="Pilih Agen" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((a) => (
                          <SelectItem key={a.id} value={a.id}>{a.nama ?? a.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminShell>
  )
}
