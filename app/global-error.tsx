'use client'

// Error boundary terluar -- menggantikan html/body saat layout root sendiri error.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="id">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>Terjadi Kesalahan</h1>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
            Mohon maaf, ada kendala pada aplikasi. Silakan coba lagi.
          </p>
          <button
            onClick={reset}
            style={{ padding: '10px 20px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  )
}
