import { useEffect, useState } from 'react'

// useState と同じ使い方で、値をブラウザ（localStorage）に自動で保存・復元する。
// 保存できない環境（プライベートモードなど）でも、画面はそのまま動く。
export function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved === null ? initialValue : JSON.parse(saved)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 保存できなくても、画面の動作は止めない
    }
  }, [key, value])

  return [value, setValue]
}
