import { MAX_RATING, MIN_RATING } from './DeliveryConstants'

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function normalizeTextInput(value: string, maxLength: number) {
  return normalizeWhitespace(value).slice(0, maxLength)
}

export function parseCurrencyAmount(value: string) {
  const parsed = Number(value.trim())
  if (!Number.isFinite(parsed)) return null
  return parsed
}

export function clampRating(value: number, min = MIN_RATING, max = MAX_RATING) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.round(value)))
}

export function isValidBusinessTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function isValidContactPhone(value: string) {
  return /^1\d{10}$/.test(value)
}

export function isValidBankAccountNumber(value: string) {
  return /^\d{10,30}$/.test(value.trim())
}
