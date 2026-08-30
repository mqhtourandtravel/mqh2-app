import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const src = await readFile(new URL('../lib/queries.ts', import.meta.url), 'utf8')

// Ambil badan fungsi getPaketBySlug saja, agar assertion tidak bocor ke fungsi lain.
const fn = src.slice(src.indexOf('export async function getPaketBySlug'))

test('getPaketBySlug hanya mengembalikan paket berstatus aktif', () => {
  assert.match(fn, /findFirst\(\{\s*where:\s*\{\s*slug,\s*status:\s*'aktif'\s*\}\s*\}\)/)
})

test('getPaketBySlug tidak lagi memakai findUnique tanpa filter status', () => {
  assert.doesNotMatch(fn, /findUnique/)
})
