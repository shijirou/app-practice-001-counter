import { describe, expect, it } from 'vitest'
import { MAX_COUNT, toValidCount } from './count.js'

describe('toValidCount', () => {
  it('0 以上 999999999 以下の整数は、そのまま返す', () => {
    expect(toValidCount(0)).toBe(0)
    expect(toValidCount(123)).toBe(123)
    expect(toValidCount(MAX_COUNT)).toBe(MAX_COUNT)
  })

  it('壊れた値は 0 にする', () => {
    for (const bad of [-1, 1.5, MAX_COUNT + 1, '5', null, undefined, NaN, Infinity, {}, []]) {
      expect(toValidCount(bad)).toBe(0)
    }
  })
})
