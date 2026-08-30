import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const resources = await readFile(new URL('../lib/adminResources.ts', import.meta.url), 'utf8')
const list = await readFile(new URL('../app/api/admin/[resource]/route.ts', import.meta.url), 'utf8')
const detail = await readFile(new URL('../app/api/admin/[resource]/[id]/route.ts', import.meta.url), 'utf8')

test('resource user ditandai read-only di adminResources', () => {
  assert.match(resources, /user:\s*\{[^}]*readOnly:\s*true/)
})

test('generic POST menolak resource read-only', () => {
  assert.match(list, /isReadOnly\(config\)[\s\S]*status:\s*405/)
})

test('generic PATCH dan DELETE menolak resource read-only', () => {
  const guards = detail.match(/isReadOnly\(config\)/g) ?? []
  assert.ok(guards.length >= 2, `expected >=2 read-only guards (PATCH+DELETE), got ${guards.length}`)
  assert.match(detail, /status:\s*405/)
})
