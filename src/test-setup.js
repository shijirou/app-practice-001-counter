import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 1テストごとに、画面の描画と localStorage をまっさらに戻す
afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
