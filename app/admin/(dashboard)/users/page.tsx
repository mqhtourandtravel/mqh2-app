'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { adminList, adminChangeRole } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { Shield, UserCheck, Users, Search, CheckCircle2 } from 'lucide-react'

const ROLE_LABELS: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  staff_admin: { label: 'Staff Admin', icon: Shield, color: 'bg-amber-50 text-amber-800 border-amber-200' },
  agen: { label: 'Agen Resmi', icon: UserCheck, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  jamaah: { label: 'Jamaah', icon: Users, color: 'bg-gray-50 text-gray-700 border-gray-200' },
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('semua')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setSuccess('')
    const { data, error: err } = await adminChangeRole(userId, newRole)
    if (err) {
      setError(err)
      return
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: (data as User).role } : u)),
    )
    setSuccess('Role pengguna berhasil diperbarui!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const filtered = users.filter((u) => {
    const matchSearch = (u.nama ?? '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.email ?? '').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'semua' || u.role === roleFilter
    return matchSearch && matchRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-amber-500 animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Memuat data pengguna...</p>
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
            <Users className="size-7 text-emerald-700" /> Kelola Pengguna & Role
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Atur hak akses akun Staff Admin, Agen resmi, dan Jamaah terdaftar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="soft" className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
            Total {users.length} Pengguna
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

      {/* Main Table Card */}
      <Card className="border border-gray-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        {/* Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/40">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'semua', label: 'Semua Role' },
              { id: 'staff_admin', label: 'Staff Admin' },
              { id: 'agen', label: 'Agen' },
              { id: 'jamaah', label: 'Jamaah' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="pl-9 h-8 text-xs bg-white border-gray-300"
            />
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/70 border-b border-gray-200/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-bold text-gray-600">Pengguna</TableHead>
                <TableHead className="text-xs font-bold text-gray-600">Email Akun</TableHead>
                <TableHead className="text-xs font-bold text-gray-600">Role Saat Ini</TableHead>
                <TableHead className="text-right pr-6 text-xs font-bold text-gray-600">Ubah Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-xs text-gray-500">
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => {
                  const roleInfo = ROLE_LABELS[user.role] ?? ROLE_LABELS.jamaah
                  const isSelf = user.auth_id === currentUserId
                  return (
                    <TableRow key={user.id} className="hover:bg-emerald-50/20 transition-colors">
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {user.photo_url ? (
                            <Image
                              src={user.photo_url}
                              alt=""
                              width={36}
                              height={36}
                              unoptimized
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center shadow-inner text-white font-bold text-xs">
                              {(user.nama ?? user.email).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {user.nama ?? <span className="italic text-gray-400">Nama belum diset</span>}
                            </p>
                            <p className="text-[11px] text-gray-400 font-mono">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 font-mono py-3.5">{user.email}</TableCell>
                      <TableCell className="py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(v) => handleChangeRole(user.id, v)}
                            disabled={isSelf}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-white border-gray-300" disabled={isSelf}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff_admin" className="text-xs">Staff Admin</SelectItem>
                              <SelectItem value="agen" className="text-xs">Agen Resmi</SelectItem>
                              <SelectItem value="jamaah" className="text-xs">Jamaah</SelectItem>
                            </SelectContent>
                          </Select>
                          {isSelf && (
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                              Anda
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
