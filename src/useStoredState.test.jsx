import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStoredState } from './useStoredState.js'

describe('useStoredState', () => {
  it('保存がなければ、初期値を使う', () => {
    const { result } = renderHook(() => useStoredState('k', 0))
    expect(result.current[0]).toBe(0)
  })

  it('保存された値を復元する', () => {
    window.localStorage.setItem('k', JSON.stringify(42))
    const { result } = renderHook(() => useStoredState('k', 0))
    expect(result.current[0]).toBe(42)
  })

  it('値を変えると localStorage に保存する', () => {
    const { result } = renderHook(() => useStoredState('k', 0))
    act(() => result.current[1](7))
    expect(window.localStorage.getItem('k')).toBe('7')
  })

  it('壊れた保存値（JSON として読めない）は、初期値にする', () => {
    window.localStorage.setItem('k', '{broken')
    const { result } = renderHook(() => useStoredState('k', 0))
    expect(result.current[0]).toBe(0)
  })

  it('保存できない環境でも、値は変えられる', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const { result } = renderHook(() => useStoredState('k', 0))
    act(() => result.current[1](3))
    expect(result.current[0]).toBe(3)
  })

  it('別のタブが同じ値を変えたら、こちらにも反映する', () => {
    const { result } = renderHook(() => useStoredState('k', 0))
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'k', newValue: '9' }))
    })
    expect(result.current[0]).toBe(9)
  })

  it('別のキーの変更は、無視する', () => {
    const { result } = renderHook(() => useStoredState('k', 0))
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: '9' }))
    })
    expect(result.current[0]).toBe(0)
  })

  it('別のタブで保存が消されたら、初期値に戻す', () => {
    window.localStorage.setItem('k', '5')
    const { result } = renderHook(() => useStoredState('k', 0))
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'k', newValue: null }))
    })
    expect(result.current[0]).toBe(0)
  })
})
