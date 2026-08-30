import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const src = await readFile(new URL('../next.config.ts', import.meta.url), 'utf8')

test('security headers didefinisikan untuk semua route', () => {
  assert.match(src, /async headers\(\)/)
  assert.match(src, /X-Content-Type-Options/)
  assert.match(src, /nosniff/)
  assert.match(src, /Referrer-Policy/)
  assert.match(src, /X-Frame-Options/)
  assert.match(src, /Permissions-Policy/)
})

test('X-Powered-By dimatikan', () => {
  assert.match(src, /poweredByHeader:\s*false/)
})
