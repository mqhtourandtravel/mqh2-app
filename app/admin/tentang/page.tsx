'use client'

import { useEffect, useState } from 'react'
import { supabase, TentangKami } from '@/lib/supabase'
import { adminList, adminUpdate } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function EditTentangKami() {
  const router = useRouter()
  const [data, setData] = useState<TentangKami | null>(null)
  const [loading, setLoading] = useState(true)
  const field = (n: number, suffix: 'label' | 'nilai') => `angka_${n}_${suffix}` as keyof TentangKami

  useEffect(() => {
    async function muat() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const rows = await adminList<TentangKami>('tentang')
      setData(rows[0] ?? null)
      setLoading(false)
    }
    muat()
  }, [router])

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!data) return
    await adminUpdate('tentang', data.id, {
      cerita: data.cerita,
      angka_1_label: data.angka_1_label, angka_1_nilai: data.angka_1_nilai,
      angka_2_label: data.angka_2_label, angka_2_nilai: data.angka_2_nilai,
      angka_3_label: data.angka_3_label, angka_3_nilai: data.angka_3_nilai,
      angka_4_label: data.angka_4_label, angka_4_nilai: data.angka_4_nilai,
    })
    alert('Tersimpan.')
  }

  if (loading || !data) return <p className="p-8 text-muted-foreground text-sm">Memuat...</p>

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Tentang Kami</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cerita">Cerita / Sejarah</Label>
                <Textarea id="cerita" value={data.cerita ?? ''} onChange={(e) => setData({ ...data, cerita: e.target.value })}
                  rows={6} placeholder="Cerita/sejarah perusahaan" />
              </div>

              <Separator />

              <h2 className="text-[13px] font-bold text-primary">Angka Pencapaian</h2>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="grid grid-cols-2 gap-2">
                  <Input
                    value={data[field(n, 'nilai')] ?? ''}
                    onChange={(e) => setData({ ...data, [field(n, 'nilai')]: e.target.value })}
                    placeholder={`Nilai ${n}, mis. 500+`} />
                  <Input
                    value={data[field(n, 'label')] ?? ''}
                    onChange={(e) => setData({ ...data, [field(n, 'label')]: e.target.value })}
                    placeholder={`Label ${n}, mis. Jamaah Diberangkatkan`} />
                </div>
              ))}
              <Button type="submit" variant="secondary" className="w-full">Simpan</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
