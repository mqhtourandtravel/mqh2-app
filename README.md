# MQH Tour & Travel (Web & Admin Portal)

Aplikasi web modern untuk travel Umroh & Haji dengan desain *Majestic Voyage* berbasis **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase Auth**, dan **Prisma**.

---

## 🚀 Fitur Utama
- **Public Portal**:
  - Homepage eksklusif dengan showcase paket, jadwal keberangkatan, section app/instagram feed.
  - Detail Paket & Itinerary interaktif.
  - Katalog Artikel & Tips Ibadah.
  - Simulasi Tabungan Umroh & Halaman Kemitraan (Partnership).
  - Direktori Kantor Cabang & Kontak WhatsApp langsung.
- **Admin Dashboard**:
  - Autentikasi Admin via Supabase Auth.
  - Manajemen Paket & Jadwal Keberangkatan.
  - Manajemen Artikel, Testimoni Jamaah, dan Kantor Cabang.
  - Master Data (Maskapai & Hotel Bintang Mekkah/Madinah).

---

## 🛠️ Setup & Instalasi Lokal

### 1. Clone Repository
```bash
git clone <URL_REPO_GITHUB_ANDA>
cd mqh2-app
```

### 2. Install Dependensi
```bash
npm install
# atau
pnpm install
```

### 3. Setup Environment
Salin `.env.example` menjadi `.env.local`, lalu isi nilainya:
```bash
cp .env.example .env.local
```
Isi variabel dengan kredensial dari Dashboard Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Prisma CLI membutuhkan file `.env` terpisah. Isi hanya `DATABASE_URL` dan
`DIRECT_URL`. Detail lengkap ada di `SETUP_ENV.md`.

### 4. Setup Database Supabase
1. Buka Dashboard Supabase project Anda.
2. Masuk ke menu **SQL Editor**.
3. Verifikasi schema yang sudah aktif dengan `npx prisma db pull`.
4. Jalankan `npx prisma generate`.
5. Buat akun Admin di menu **Authentication > Users** (Add User).

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.
- Halaman Publik: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin/login`

---

## 📂 Struktur Folder
```
├── app/                  # Next.js App Router Pages
│   ├── admin/            # Dashboard Admin (CRUD Paket, Artikel, dll)
│   ├── artikel/          # Halaman Blog / Artikel
│   ├── cabang/           # Direktori Cabang
│   ├── paket/            # Detail & Katalog Paket Umroh
│   ├── partnership/      # Program Kemitraan
│   ├── tabungan-umroh/   # Simulasi Tabungan
│   └── page.tsx          # Homepage
├── components/           # Reusable UI Components
├── lib/
│   ├── queries.ts         # Query server melalui Prisma
│   ├── prisma.ts          # Prisma singleton
│   ├── supabase.ts        # Supabase Auth client & types
│   └── adminAuth.ts       # Validasi token admin API
├── supabase/
│   └── schema.sql        # Database Table, RLS & Relations
├── public/               # Static assets
└── package.json
```
