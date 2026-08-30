import test from 'node:test'
import assert from 'node:assert/strict'
import { clampPagination } from '../lib/pagination.ts'

test('input valid dipakai apa adanya', () => {
  assert.deepEqual(clampPagination('3', '25'), { page: 3, perPage: 25 })
})

test('input hilang memakai default 1 dan 12', () => {
  assert.deepEqual(clampPagination(null, null), { page: 1, perPage: 12 })
})

test('page negatif dan nol dipaksa ke 1', () => {
  assert.equal(clampPagination('-2', null).page, 1)
  assert.equal(clampPagination('0', null).page, 1)
})

test('per_page non-integer (abc) tidak menghasilkan NaN', () => {
  const { perPage } = clampPagination(null, 'abc')
  assert.ok(Number.isInteger(perPage))
  assert.equal(perPage, 12)
})

test('per_page dibatasi atas ke 100', () => {
  assert.equal(clampPagination(null, '99999').perPage, 100)
})

test('page sangat besar dibatasi ke MAX_PAGE', () => {
  const { page } = clampPagination('999999999999999999999', null)
  assert.ok(Number.isInteger(page))
  assert.ok(page <= 10000)
})

test('input desimal dibuang, bukan dibulatkan diam-diam', () => {
  assert.equal(clampPagination('2.5', null).page, 1)
})
