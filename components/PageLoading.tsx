// Ditampilkan otomatis oleh Next.js saat page.tsx di folder yang sama masih
// menunggu data (Prisma) sebelum bisa render. Tanpa file loading.tsx di
// sebuah route, user akan melihat layar kosong selama proses itu.
export default function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-accent border-t-secondary-hover animate-spin" role="status" aria-label="Memuat">
          <span className="sr-only">Memuat...</span>
        </div>
        <p className="text-[12.5px] text-muted-foreground" aria-hidden="true">Memuat...</p>
      </div>
    </div>
  )
}
