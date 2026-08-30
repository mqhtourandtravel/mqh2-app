import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../app/api/bookings/[id]/route.ts', import.meta.url), 'utf8')

test('agen hanya dapat membaca booking jamaah binaannya', () => {
  assert.match(source, /agenId:\s*true/)
  assert.match(source, /auth\.user\.role === 'agen'[\s\S]*booking\.user\.agenId !== auth\.user\.id/)
})
