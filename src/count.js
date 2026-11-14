export const MAX_COUNT = 999999999

// 保存されていた値が壊れていても、0 以上の整数に直して使う
export function toValidCount(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_COUNT ? value : 0
}
