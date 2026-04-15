import {
  CURRENCY_CENTS_SCALE,
  MAX_CONTACT_PHONE_LENGTH,
  MAX_RATING,
  MIN_PHONE_LENGTH,
  MIN_RATING,
} from './DeliveryConstants'

const WHITESPACE_SEQUENCE_PATTERN = /\s+/g
const BUSINESS_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const BANK_ACCOUNT_NUMBER_PATTERN = /^[0-9 ]{8,30}$/

function createContactPhonePattern() {
  return new RegExp(`^[0-9+\\- ]{${MIN_PHONE_LENGTH},${MAX_CONTACT_PHONE_LENGTH}}$`)
}

const CONTACT_PHONE_PATTERN = createContactPhonePattern()

export function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

export function normalizeWhitespace(value: string) {
  return value.replace(WHITESPACE_SEQUENCE_PATTERN, ' ')
}

export function normalizeTextInput(value: string, maxLength: number) {
  return normalizeWhitespace(value).trim().slice(0, maxLength)
}

export function isValidBusinessTime(value: string) {
  return BUSINESS_TIME_PATTERN.test(value)
}

export function isValidContactPhone(value: string) {
  return CONTACT_PHONE_PATTERN.test(value)
}

export function isValidBankAccountNumber(value: string) {
  return BANK_ACCOUNT_NUMBER_PATTERN.test(value)
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
