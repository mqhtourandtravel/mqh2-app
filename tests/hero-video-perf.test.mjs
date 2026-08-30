import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const hero = await readFile(new URL('../components/blocks/scroll-expansion-hero.tsx', import.meta.url), 'utf8')
const cfg = await readFile(new URL('../next.config.ts', import.meta.url), 'utf8')

test('video hero tidak memakai preload auto', () => {
  assert.doesNotMatch(hero, /preload=['"]auto['"]/)
  assert.match(hero, /preload=['"]metadata['"]/)
})

test('aset video mendapat cache header jangka menengah', () => {
  assert.match(cfg, /source:\s*["']\/videos\/:path\*["']/)
  assert.match(cfg, /Cache-Control/)
  assert.match(cfg, /max-age=\d+/)
})
