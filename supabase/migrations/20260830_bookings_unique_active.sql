-- Tahap 3 audit: cegah race condition duplicate booking.
-- Satu user hanya boleh punya SATU booking aktif (non-cancelled) per keberangkatan.
-- Partial index: booking cancelled tidak dihitung, jadi user boleh booking ulang
-- setelah membatalkan.
--
-- PENTING: DB produksi dikelola langsung di Supabase (bukan prisma migrate).
-- Jalankan file ini SEKALI via Supabase SQL Editor saat project aktif (tidak paused).
-- Sebelum menjalankan, cek duplikat yang sudah ada — kalau ada, index gagal dibuat:
--
--   SELECT user_id, keberangkatan_id, count(*)
--   FROM bookings
--   WHERE status <> 'cancelled'
--   GROUP BY user_id, keberangkatan_id
--   HAVING count(*) > 1;
--
-- Kalau query di atas mengembalikan baris, rapikan dulu (sisa-kan satu, sisanya
-- 'cancelled'), baru jalankan CREATE INDEX.

CREATE UNIQUE INDEX IF NOT EXISTS uniq_booking_aktif
ON bookings (user_id, keberangkatan_id)
WHERE status <> 'cancelled';
