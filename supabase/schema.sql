-- ============================================================
-- SCHEMA DATABASE MQH2 -- VERSI YANG BENAR-BENAR DIPAKAI KODE
-- Ini BUKAN untuk dijalankan ulang di Supabase yang sudah ada
-- datanya -- ini cuma DOKUMENTASI referensi field yang dipakai
-- lib/supabase.ts dan seluruh halaman.
--
-- Kalau Supabase project kamu SUDAH berjalan dengan data asli,
-- JANGAN jalankan file ini. Database kamu yang sekarang sudah
-- benar. File ini cuma cadangan kalau suatu saat perlu setup
-- Supabase project baru dari nol.
-- ============================================================

create table if not exists maskapai (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  logo_url text
);

create table if not exists hotel (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kota text not null check (kota in ('mekkah', 'madinah')),
  google_maps_url text
);

create table if not exists paket (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nama_paket text not null,
  kategori text not null check (kategori in ('umroh', 'haji', 'badal', 'tour')),
  tier text,
  deskripsi text,
  gambar_url text,
  status text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  urutan integer default 0,
  created_at timestamptz default now()
);

create table if not exists keberangkatan (
  id uuid primary key default gen_random_uuid(),
  paket_id uuid not null references paket(id) on delete cascade,
  tanggal_berangkat date not null,
  durasi_hari integer,
  lokasi_keberangkatan text,
  maskapai_id uuid references maskapai(id),
  hotel_mekkah_id uuid references hotel(id),
  hotel_madinah_id uuid references hotel(id),
  harga_normal numeric not null,
  harga_promo numeric,
  kuota_total integer not null default 0,
  kuota_tersisa integer not null default 0,
  status text not null default 'tersedia' check (status in ('tersedia', 'terbatas', 'penuh', 'ditutup')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cabang (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tipe text not null default 'representatif' check (tipe in ('pusat', 'representatif')),
  kota text not null,
  alamat text,
  telepon text,
  whatsapp text,
  jam_layanan text,
  email text,
  google_maps_url text,
  urutan integer default 0,
  status text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  created_at timestamptz default now()
);

create table if not exists testimoni (
  id uuid primary key default gen_random_uuid(),
  isi text not null,
  nama_sumber text not null,
  urutan integer default 0,
  status text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  created_at timestamptz default now()
);

create table if not exists artikel (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  judul text not null,
  ringkasan text,
  konten text not null,
  kategori text,
  gambar_url text,
  status text not null default 'draft' check (status in ('draft', 'terbit')),
  diterbitkan_pada timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists tentang_kami (
  id uuid primary key default gen_random_uuid(),
  cerita text,
  angka_1_label text,
  angka_1_nilai text,
  angka_2_label text,
  angka_2_nilai text,
  angka_3_label text,
  angka_3_nilai text,
  angka_4_label text,
  angka_4_nilai text,
  updated_at timestamptz default now()
);

-- Trigger auto-update status kuota
create or replace function auto_update_status_kuota()
returns trigger as $$
begin
  if new.kuota_tersisa <= 0 then
    new.status = 'penuh';
  elsif new.kuota_tersisa <= 3 then
    new.status = 'terbatas';
  else
    new.status = 'tersedia';
  end if;
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_keberangkatan_kuota
before insert or update of kuota_tersisa on keberangkatan
for each row execute function auto_update_status_kuota();

-- Row Level Security: publik boleh baca data aktif, hanya admin login boleh ubah
alter table paket enable row level security;
alter table keberangkatan enable row level security;
alter table maskapai enable row level security;
alter table hotel enable row level security;
alter table cabang enable row level security;
alter table testimoni enable row level security;
alter table artikel enable row level security;
alter table tentang_kami enable row level security;

create policy "Publik lihat paket aktif" on paket for select using (status = 'aktif');
create policy "Admin kelola paket" on paket for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat jadwal" on keberangkatan for select using (true);
create policy "Admin kelola jadwal" on keberangkatan for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat maskapai" on maskapai for select using (true);
create policy "Admin kelola maskapai" on maskapai for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat hotel" on hotel for select using (true);
create policy "Admin kelola hotel" on hotel for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat cabang aktif" on cabang for select using (status = 'aktif');
create policy "Admin kelola cabang" on cabang for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat testimoni aktif" on testimoni for select using (status = 'aktif');
create policy "Admin kelola testimoni" on testimoni for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat artikel terbit" on artikel for select using (status = 'terbit');
create policy "Admin kelola artikel" on artikel for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Publik lihat tentang kami" on tentang_kami for select using (true);
create policy "Admin kelola tentang kami" on tentang_kami for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
