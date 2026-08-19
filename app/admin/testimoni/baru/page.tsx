'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { adminCreate } from '@/lib/adminApi'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function TambahTestimoni() {
  const router = useRouter()
  const [isi, setIsi] = useState('')
  const [namaSumber, setNamaSumber] = useState('')
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
    await adminCreate('testimoni', { isi, nama_sumber: namaSumber })
    setLoading(false)
    router.push('/admin/testimoni')
  }

  return (
    <AdminShell>
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tambah Testimoni</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={simpan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isi">Isi Testimoni</Label>
                <Textarea id="isi" required placeholder="Isi testimoni jamaah" value={isi}
                  onChange={(e) => setIsi(e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama_sumber">Nama Sumber</Label>
                <Input id="nama_sumber" required placeholder="Nama sumber, mis. Jamaah Kloter 214" value={namaSumber}
                  onChange={(e) => setNamaSumber(e.target.value)} />
              </div>
              <Button type="submit" variant="secondary" disabled={loading} className="w-full">
                {loading ? 'Menyimpan...' : 'Simpan Testimoni'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminShell>
  )
}
