// Re-export dari lib/auth.ts untuk backward compatibility.
// Semua file yang import dari '@/lib/adminAuth' tetap works.
// File ini TIDAK dipakai untuk logic baru — pindah ke '@/lib/auth'.

export { verifyAdmin, verifyRole, getUser, ROLES } from '@/lib/auth'
export type { Role, AuthUser } from '@/lib/auth'
