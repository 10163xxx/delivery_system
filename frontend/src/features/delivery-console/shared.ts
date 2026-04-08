import { CURRENCY_CENTS_SCALE, MAX_RATING, MIN_RATING } from './constants'

export function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

export function normalizeTextInput(value: string, maxLength: number) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function clampRating(value: number) {
  return Math.max(MIN_RATING, Math.min(MAX_RATING, value))
}

export function parseCurrencyAmount(value: string) {
  const sanitized = value.trim().replaceAll('，', ',').replaceAll(',', '')
  if (!sanitized) return null
  const amount = Number(sanitized)
  if (!Number.isFinite(amount)) return null
  return Math.round(amount * CURRENCY_CENTS_SCALE) / CURRENCY_CENTS_SCALE
}
