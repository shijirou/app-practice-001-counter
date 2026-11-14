import { useState } from 'react'
import { useStoredState } from './useStoredState.js'
import './App.css'

const MAX_COUNT = 999999999

// 保存されていた値が壊れていても、0 以上の整数に直して使う
function toValidCount(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_COUNT ? value : 0
}

function App() {
  const [storedCount, setCount] = useStoredState('counter.count', 0)
  const [productName, setProductName] = useStoredState('counter.productName', '')
  // 入力中の文字。null のときは、現在の数量をそのまま見せる
  const [draft, setDraft] = useState(null)

  const count = toValidCount(storedCount)
  const name = typeof productName === 'string' ? productName : ''

  const increase = () => {
    setCount(Math.min(count + 1, MAX_COUNT))
    setDraft(null)
  }
  const decrease = () => {
    setCount(Math.max(count - 1, 0))
    setDraft(null)
  }

  const handleDraftChange = (event) => {
    // 数字だけ受け付ける（マイナス・小数・文字は入力できない）
    if (/^\d{0,9}$/.test(event.target.value)) {
      setDraft(event.target.value)
    }
  }

  const commitDraft = () => {
    // 空のまま確定したときは 0 にする
    if (draft !== null) {
      setCount(draft === '' ? 0 : toValidCount(Number(draft)))
    }
    setDraft(null)
  }

  const reset = () => {
    if (window.confirm('数量を 0 に戻します。よろしいですか？')) {
      setCount(0)
      setDraft(null)
    }
  }

  return (
    <main className="counter">
      <h1 className="counter__title">製造数量カウンター</h1>

      <label className="counter__field">
        <span>商品名</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="例: 架空クッキー"
          maxLength={50}
        />
      </label>

      {/* 押し間違いしやすい操作は、親指の付け根が当たりにくい上のほうに置く */}
      <div className="counter__tools">
        <button
          type="button"
          className="button button--small"
          onClick={decrease}
          disabled={count === 0}
        >
          －1
        </button>
        <label className="counter__field counter__field--tool">
          <span>数量を直す</span>
          <input
            type="text"
            inputMode="numeric"
            value={draft ?? String(count)}
            onChange={handleDraftChange}
            onFocus={(event) => event.target.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitDraft()
            }}
          />
        </label>
        {/* 入力中だけ緑になって押せる。普段は薄い表示 */}
        <button
          type="button"
          className="button button--small button--confirm"
          onClick={commitDraft}
          disabled={draft === null}
        >
          決定
        </button>
        <button
          type="button"
          className="button button--small button--danger"
          onClick={reset}
        >
          リセット
        </button>
      </div>

      <p className="counter__count" aria-live="polite">
        <span className="counter__label">現在の数量</span>
        {/* 桁数に合わせて文字の大きさを変え、数字が途中で折り返さないようにする */}
        <span className="counter__number" style={{ '--digits': String(count).length }}>
          {count}
        </span>
      </p>

      <button type="button" className="button button--primary" onClick={increase}>
        ＋1
      </button>
    </main>
  )
}

export default App
