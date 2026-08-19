# MQH2 -- Setup Fondasi Prisma + shadcn/ui

Tech stack sekarang: React + Next.js + Supabase (Auth) + Prisma (ORM) +
Tailwind + shadcn/ui.

## Yang sudah disiapkan di tahap fondasi ini

1. **prisma/schema.prisma** -- mencerminkan tabel yang SUDAH AKTIF di
   Supabase kamu (paket, keberangkatan, maskapai, hotel, cabang,
   testimoni, artikel, tentang_kami). Field-nya di-map persis sama
   nama kolom asli lewat @map(), jadi TIDAK mengubah struktur database
   yang sudah ada.
2. **lib/prisma.ts** -- client Prisma singleton
3. **components.json** -- konfigurasi shadcn/ui, tema "new-york",
   warna sudah dipetakan ke palet Majestic Voyage (krem/espresso/gold)
4. **app/globals.css** -- variabel tema shadcn (--primary, --secondary,
   dst) sudah diisi warna brand kita, BUKAN abu-abu default shadcn
5. **package.json** -- ditambah dependency: @prisma/client, prisma,
   clsx, tailwind-merge, class-variance-authority, lucide-react,
   @radix-ui/react-slot, tw-animate-css

## Langkah instalasi

### 1. Install dependency baru
```
npm install
```

### 2. Ambil connection string Prisma dari Supabase
Buka Supabase Dashboard > Project Settings > Database > Connection String.
Kamu butuh DUA jenis:
- **Transaction pooler** (port 6543) -> untuk `DATABASE_URL`
- **Direct connection** (port 5432) -> untuk `DIRECT_URL`

Isi ke `.env.local` (copy dari `.env.example`, isi password Supabase kamu).

### 3. Tarik struktur tabel yang SUDAH ADA ke Prisma (verifikasi)
```
npx prisma db pull
```
Ini akan membandingkan `schema.prisma` dengan database asli. Kalau ada
perbedaan, Prisma akan kasih tahu (dan schema.prisma akan disesuaikan
otomatis mengikuti database asli -- database yang jadi sumber kebenaran,
bukan file schema.prisma yang saya tulis manual).

### 4. Generate Prisma Client
```
npx prisma generate
```

### 5. Test koneksi
```
npx prisma studio
```
Ini akan buka browser dengan tampilan data kamu (kalau berhasil connect,
berarti Prisma sudah tersambung dengan benar ke database Supabase yang sama).

### 6. Install komponen shadcn/ui sesuai kebutuhan
Contoh untuk mulai:
```
npx shadcn@latest add button input select card badge dialog dropdown-menu
```

## PENTING

- **Belum ada halaman yang dikonversi ke Prisma** -- semua halaman masih
  pakai `lib/supabase.ts` (query langsung Supabase client) seperti biasa,
  APLIKASI TETAP JALAN NORMAL seperti sebelumnya.
- Fondasi Prisma ini baru DISIAPKAN, belum DIPAKAI di halaman manapun.
  Konversi tiap halaman dari Supabase client ke Prisma akan dikerjakan
  bertahap di sesi berikutnya.
- RLS (Row Level Security) di Supabase tetap aktif dan tetap melindungi
  akses lewat `lib/supabase.ts`. Nanti kalau halaman sudah pindah ke
  Prisma, proteksi akses HARUS dipindah ke level kode (cek sesi di server),
  karena koneksi Prisma tidak lewat RLS.

## Instagram Feed (beranda)

Section "Instagram" di beranda (`app/page.tsx`) mengambil post asli lewat
**Instagram Graph API resmi** (`lib/instagram.ts`). Selama env var di bawah
belum diisi, section ini otomatis jatuh ke kartu profil statis (bio + tombol
follow) -- bukan grid kosong atau error.

### Langkah aktivasi (dikerjakan sekali di akun Instagram MQH)

1. Ubah akun Instagram `@mqhtourandtravel` jadi **Business** atau **Creator**
   (Pengaturan > Akun > Beralih ke akun profesional), lalu hubungkan ke
   sebuah **Facebook Page** (boleh Page baru khusus untuk ini).
2. Buka [Meta for Developers](https://developers.facebook.com/), buat App
   baru, tambahkan produk **Instagram Graph API**.
3. Di App tersebut, generate **User Access Token** dengan permission
   `instagram_basic` dan `pages_show_list`, lalu tukar jadi
   **long-lived token** (berlaku ~60 hari, perlu di-refresh berkala --
   bisa dijadwalkan lewat cron/serverless function terpisah).
4. Ambil **Instagram User ID** akun bisnis lewat endpoint
   `GET /me/accounts` lalu `GET /{page-id}?fields=instagram_business_account`.
5. Isi di `.env.local` (dan environment variables Vercel untuk production):
   ```
   INSTAGRAM_ACCESS_TOKEN=xxxxx
   INSTAGRAM_USER_ID=xxxxx
   ```
6. Deploy ulang. Grid 5 post terbaru akan otomatis tampil di beranda,
   masing-masing link ke post aslinya di Instagram.

Kalau token kedaluwarsa atau belum diisi, situs tidak akan error --
otomatis kembali ke kartu profil statis.
