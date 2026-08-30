import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const post = await readFile(new URL('../app/api/bookings/route.ts', import.meta.url), 'utf8')
const sql = await readFile(new URL('../supabase/migrations/20260830_bookings_unique_active.sql', import.meta.url), 'utf8')

test('POST /api/bookings mengubah duplikasi P2002 menjadi 409', () => {
  assert.match(post, /P2002[\s\S]*status:\s*409/)
})

test('migration SQL membuat partial unique index booking aktif', () => {
  assert.match(sql, /CREATE\s+UNIQUE\s+INDEX/i)
  assert.match(sql, /bookings/i)
  assert.match(sql, /user_id[\s\S]*keberangkatan_id|keberangkatan_id[\s\S]*user_id/i)
  assert.match(sql, /status\s*<>\s*'cancelled'/i)
})
