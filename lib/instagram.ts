// Ambil beberapa post terbaru dari Instagram Business/Creator account MQH
// lewat Instagram Graph API resmi -- BUKAN scraping, BUKAN data statis.
//
// Kenapa butuh access token, bukan langsung fetch dari instagram.com:
// Instagram tidak menyediakan feed publik tanpa autentikasi. Untuk
// menampilkan post asli secara legal & stabil, akun Instagram harus
// jenis Business/Creator dan terhubung ke Facebook Page, lalu ambil
// access token dari Meta for Developers. Detail langkahnya ada di
// CARA_PASANG.md bagian "Instagram Feed".
//
// Selama INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_USER_ID belum diisi di env,
// fungsi ini mengembalikan [] dengan aman -- pemanggil (app/page.tsx)
// akan otomatis jatuh ke kartu profil statis (bio + tombol follow),
// bukan menampilkan grid kosong atau error ke pengunjung.

export type InstagramPost = {
  id: string
  caption?: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
}

const GRAPH_API_VERSION = 'v21.0'

export async function getInstagramFeed(limit = 5): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!accessToken || !userId) {
    // Belum dikonfigurasi -- bukan error, cuma belum aktif.
    return []
  }

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink'
    const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    const res = await fetch(url, {
      // cache 1 jam -- feed Instagram tidak perlu real-time
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('[instagram] Graph API error', res.status, await res.text())
      return []
    }

    const json = await res.json()
    const data = Array.isArray(json?.data) ? json.data : []

    return data.map((item: any) => ({
      id: item.id,
      caption: item.caption,
      mediaType: item.media_type,
      mediaUrl: item.media_type === 'VIDEO' ? (item.thumbnail_url ?? item.media_url) : item.media_url,
      thumbnailUrl: item.thumbnail_url,
      permalink: item.permalink,
    }))
  } catch (err) {
    console.error('[instagram] Gagal mengambil feed:', err)
    return []
  }
}
