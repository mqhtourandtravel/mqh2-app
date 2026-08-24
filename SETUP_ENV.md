# Cara Setup File .env

## Langkah 1 -- Buat 2 file
Di root project (sejajar dengan package.json), buat:
1. `.env.local` -- isi SEMUA variabel (dipakai aplikasi Next.js)
2. `.env` -- isi CUMA `DATABASE_URL` dan `DIRECT_URL` (dipakai Prisma CLI)

Copy dari `.env.example` sebagai starting point untuk `.env.local`.
File `.env.example` hanya berisi placeholder, bukan kredensial aktif.

## Langkah 2 -- Ambil kredensial Supabase Auth
1. Buka https://supabase.com/dashboard
2. Pilih project `mqhtourandtravel`
3. Klik ikon gear (Settings) di sidebar kiri bawah > **API Keys**
4. Copy **Project URL** -> jadi `NEXT_PUBLIC_SUPABASE_URL`
5. Copy key publishable/anon dari dashboard -> jadi
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Langkah 3 -- Ambil connection string Prisma
1. Masih di Settings, klik **Database**
2. Cari bagian **Connection String** atau tombol **Connect**
3. Ada 2 tab/opsi:
   - **Transaction pooler** (port 6543) -> copy ke `DATABASE_URL`
   - **Session/Direct connection** (port 5432) -> copy ke `DIRECT_URL`
4. Ganti bagian `[YOUR-PASSWORD]` di connection string dengan password
   database Supabase kamu (BUKAN password login akun Supabase -- ini
   password khusus database yang di-set waktu bikin project pertama kali).

   Lupa password database? Di halaman Database Settings ada tombol
   "Reset Database Password" -- generate baru, lalu update juga di sini.

## Langkah 4 -- Isi ke kedua file
`.env.local` -- isi SEMUA baris dari .env.example.
`.env` -- isi HANYA 2 baris ini:
```
DATABASE_URL="postgresql://...(sama seperti di .env.local)"
DIRECT_URL="postgresql://...(sama seperti di .env.local)"
```

Variabel frontend opsional:

```env
NEXT_PUBLIC_NOMOR_WA=6285868969000
NEXT_PUBLIC_SITE_URL=https://mqhtourandtravel.com
NEXT_PUBLIC_HERO_IMG=https://...
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
```

`INSTAGRAM_ACCESS_TOKEN` dan `INSTAGRAM_USER_ID` tidak boleh memakai
prefix `NEXT_PUBLIC_`; token harus tetap server-side.

## Langkah 5 -- Test koneksi Prisma
```
npx prisma db pull
npx prisma generate
```
Kalau berhasil tanpa error, koneksi sudah benar. `db pull` akan
membandingkan schema.prisma dengan database asli -- kalau ada
perbedaan, Prisma kasih tahu (dan database asli yang jadi acuan,
bukan file schema.prisma).

## Langkah 6 -- Jalankan aplikasi
```
npm install
npm run dev
```

Untuk cek production build:

```bash
npm run build
```

## Instagram (opsional, boleh dilewati dulu)
Biarkan `INSTAGRAM_ACCESS_TOKEN` dan `INSTAGRAM_USER_ID` kosong dulu --
homepage akan otomatis pakai kartu profil statis, tidak error. Kalau
nanti mau live feed beneran, perlu setup akun Instagram Business +
Meta for Developers (agak panjang, kabari kalau mau dibantu step-by-step).
