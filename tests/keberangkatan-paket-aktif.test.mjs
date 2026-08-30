import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const src = await readFile(new URL('../lib/queries.ts', import.meta.url), 'utf8')
const fn = src.slice(src.indexOf('export async function getKeberangkatanAktif'), src.indexOf('export async function getKeberangkatanByPaketId'))

test('daftar keberangkatan hanya menyertakan paket aktif (konsisten dengan halaman detail)', () => {
  assert.match(fn, /paket:\s*\{\s*is:\s*\{\s*status:\s*'aktif'\s*\}\s*\}/)
})
