'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { adminList, adminChangeRole } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, UserCheck, Users } from 'lucide-react'

const ROLE_LABELS: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  staff_admin: { label: 'Staff Admin', icon: Shield, color: 'bg-secondary/10 text-secondary' },
  agen: { label: 'Agen', icon: UserCheck, color: 'bg-blue-500/10 text-blue-600' },
  jamaah: { label: 'Jamaah', icon: Users, color: 'bg-muted text-muted-foreground' },
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      setCurrentUserId(session.user.id)

      const data = await adminList<User>('user', { orderBy: 'created_at', dir: 'desc' })
      setUsers(data)
      setLoading(false)
    }
    init()
  }, [router])

  async function handleChangeRole(userId: string, newRole: string) {
    setError('')
    const { data, error: err } = await adminChangeRole(userId, newRole)
    if (err) {
      setError(err)
      return
    }
    // Update local state
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: (data as User).role } : u)),
    )
  }

  if (loading) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Kelola User</CardTitle>
            <Badge variant="soft">{users.length} user</Badge>
          </CardHeader>
          <CardContent className="pb-6">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/20">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const roleInfo = ROLE_LABELS[user.role] ?? ROLE_LABELS.jamaah
                  const isSelf = user.auth_id === currentUserId
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.photo_url ? (
                            <Image
                              src={user.photo_url}
                              alt=""
                              width={32}
                              height={32}
                              unoptimized
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-[11px] font-semibold text-primary">
                                {(user.nama ?? user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-primary">
                            {user.nama ?? <span className="italic text-muted-foreground">-</span>}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(v) => handleChangeRole(user.id, v)}
                            disabled={isSelf}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-[12px]" disabled={isSelf}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff_admin">Staff Admin</SelectItem>
                              <SelectItem value="agen">Agen</SelectItem>
                              <SelectItem value="jamaah">Jamaah</SelectItem>
                            </SelectContent>
                          </Select>
                          {isSelf && (
                            <span className="text-[11px] text-muted-foreground">(Anda)</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Belum ada user terdaftar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
