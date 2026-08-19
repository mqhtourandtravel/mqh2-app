# MQH2 -- Setup Fondasi Prisma + shadcn/ui

Tech stack sekarang: React + Next.js + Supabase (Auth) + Prisma (ORM) +
Tailwind + shadcn/ui.

## Arsitektur sekarang

- Public data query: Prisma melalui `lib/queries.ts`.
- Admin login: Supabase Auth melalui `app/admin/login/page.tsx`.
- Admin CRUD: API route `/api/admin/[resource]` dengan Prisma.
- Validasi request admin: `lib/adminAuth.ts` memeriksa Bearer token Supabase.
- `lib/supabase.ts` tetap dipakai untuk Auth client dan tipe data, bukan query
  public utama.

## Yang sudah disiapkan

1. **prisma/schema.prisma** -- mencerminkan tabel yang SUDAH AKTIF di
   Supabase kamu (paket, keberangkatan, maskapai, hotel, cabang,
   testimoni, artikel, tentang_kami). Field-nya di-map persis sama
   nama kolom asli lewat @map(), jadi TIDAK mengubah struktur database
   yang sudah ada.
2. **lib/prisma.ts** -- client Prisma singleton
3. **lib/queries.ts** -- query public melalui Prisma
4. **components.json** -- konfigurasi shadcn/ui, tema "new-york",
   warna sudah dipetakan ke palet Majestic Voyage (krem/espresso/gold)
5. **app/globals.css** -- variabel tema shadcn (--primary, --secondary,
   dst) sudah diisi warna brand kita, BUKAN abu-abu default shadcn
6. **package.json** -- dependency Prisma, Supabase, shadcn/ui, dan UI runtime
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

Isi ke `.env` dan `.env.local` sesuai `SETUP_ENV.md`. Jangan commit file env.

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

- Prisma sudah dipakai oleh public query dan admin CRUD.
- Prisma direct connection tidak otomatis menerapkan Supabase RLS.
- Endpoint `/api/admin/*` wajib memvalidasi sesi melalui `lib/adminAuth.ts`.
- Jangan memakai Prisma dari Client Component.
- `npx prisma db pull` hanya untuk sinkronisasi schema dari database; jangan
  menjalankan `prisma db push` tanpa review perubahan database.

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
