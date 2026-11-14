import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

const number = () => document.querySelector('.counter__number')

describe('カウンター画面', () => {
  it('はじめは 0 で、「－1」は押せない', () => {
    render(<App />)
    expect(number()).toHaveTextContent('0')
    expect(screen.getByRole('button', { name: '－1' })).toBeDisabled()
  })

  it('＋1 で増え、－1 で減る', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '＋1' }))
    await user.click(screen.getByRole('button', { name: '＋1' }))
    expect(number()).toHaveTextContent('2')
    await user.click(screen.getByRole('button', { name: '－1' }))
    expect(number()).toHaveTextContent('1')
  })

  it('数量は保存され、開き直しても残る', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await user.click(screen.getByRole('button', { name: '＋1' }))
    first.unmount()
    render(<App />)
    expect(number()).toHaveTextContent('1')
  })

  it('上限（999999999）で止まる', async () => {
    window.localStorage.setItem('counter.count', '999999999')
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '＋1' }))
    expect(number()).toHaveTextContent('999999999')
  })

  it('壊れた保存値は 0 として扱う', () => {
    window.localStorage.setItem('counter.count', '-5')
    render(<App />)
    expect(number()).toHaveTextContent('0')
  })

  it('数量を直接入力し、Enter で確定できる', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('数量を直す'))
    await user.keyboard('123{Enter}')
    expect(number()).toHaveTextContent('123')
  })

  it('数量を直接入力し、「決定」で確定できる', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('数量を直す'))
    await user.keyboard('45')
    await user.click(screen.getByRole('button', { name: '決定' }))
    expect(number()).toHaveTextContent('45')
  })

  it('数量の欄には、数字以外と 10 桁目は入力できない', async () => {
    const user = userEvent.setup()
    render(<App />)
    const field = screen.getByLabelText('数量を直す')
    await user.click(field)
    await user.keyboard('1a-2.3')
    expect(field).toHaveValue('123')
    await user.keyboard('4567890')
    expect(field).toHaveValue('123456789')
  })

  it('空のまま確定すると 0 になる', async () => {
    window.localStorage.setItem('counter.count', '8')
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('数量を直す'))
    await user.keyboard('{Backspace}{Enter}')
    expect(number()).toHaveTextContent('0')
  })

  it('リセットは、確認で OK のときだけ 0 に戻す', async () => {
    window.localStorage.setItem('counter.count', '8')
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, 'confirm')
    render(<App />)

    confirm.mockReturnValue(false)
    await user.click(screen.getByRole('button', { name: 'リセット' }))
    expect(number()).toHaveTextContent('8')

    confirm.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'リセット' }))
    expect(number()).toHaveTextContent('0')
  })

  it('商品名は 50 文字までで、保存される', async () => {
    const user = userEvent.setup()
    render(<App />)
    const field = screen.getByLabelText('商品名')
    expect(field).toHaveAttribute('maxlength', '50')
    await user.type(field, '架空クッキー')
    expect(window.localStorage.getItem('counter.productName')).toBe('"架空クッキー"')
  })

  it('別のタブで数量が変わったら、こちらにも反映する', () => {
    render(<App />)
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'counter.count', newValue: '3' }),
      )
    })
    expect(number()).toHaveTextContent('3')
  })
})
