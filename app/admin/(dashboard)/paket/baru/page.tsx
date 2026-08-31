'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { adminCreate } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { buatSlug } from '@/lib/utils'

export default function TambahPaket() {
  const router = useRouter()
  const [form, setForm] = useState({
    nama_paket: '', kategori: 'umroh', tier: '', deskripsi: '', gambar_url: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function cekLogin() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin/login')
    }
    cekLogin()
  }, [router])

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const slug = buatSlug(form.nama_paket)
    const { error } = await adminCreate('paket', {
      slug,
      nama_paket: form.nama_paket,
      kategori: form.kategori,
      tier: form.tier || null,
      deskripsi: form.deskripsi || null,
      gambar_url: form.gambar_url || null,
    })
    setLoading(false)
    if (error) {
      setError(error.includes('duplicate') ? 'Nama paket sudah dipakai (slug bentrok).' : error)
      return
    }
    router.push('/admin/paket')
  }

  return (
    <>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tambah Paket Baru</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nama_paket">Nama Paket</Label>
                <Input
                  id="nama_paket"
                  required
                  value={form.nama_paket}
                  onChange={(e) => setForm({ ...form, nama_paket: e.target.value })}
                  placeholder="Umroh Berkah 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v })}>
                  <SelectTrigger id="kategori" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umroh">Umroh</SelectItem>
                    <SelectItem value="haji">Haji</SelectItem>
                    <SelectItem value="badal">Badal</SelectItem>
                    <SelectItem value="tour">Tour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier (opsional)</Label>
                <Input
                  id="tier"
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  placeholder="Reguler / Privat / Hemat / Plus Tour"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gambar_url">URL Gambar</Label>
                <Input
                  id="gambar_url"
                  value={form.gambar_url}
                  onChange={(e) => setForm({ ...form, gambar_url: e.target.value })}
                  placeholder="/images/paket-baru.jpg"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" variant="secondary" disabled={loading} className="w-full">
                {loading ? 'Menyimpan...' : 'Simpan Paket'}
              </Button>
              <p className="text-[11.5px] text-muted-foreground">
                Setelah paket tersimpan, tambahkan jadwal keberangkatan dari halaman edit paket.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
