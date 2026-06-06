import { MAX_RATING, MIN_RATING } from './DeliveryConstants'
import { DELIVERY_INPUT_PATTERNS } from './DeliveryPatterns'
import type { RawBooleanValue, RawNumericValue, RawTextValue } from '@/objects/domain/DomainTypes'

export function asDomainText<T extends RawTextValue>(value: RawTextValue): T {
  return value as T
}

export function asDomainNumber<T extends RawNumericValue>(value: RawNumericValue): T {
  return value as T
}

export function asDomainBoolean<T extends RawBooleanValue>(value: RawBooleanValue): T {
  return value as T
}

export function normalizeWhitespace(value: RawTextValue) {
  return value.replace(/\s+/g, ' ').trim()
}

export function normalizeTextInput(value: RawTextValue, maxLength: RawNumericValue) {
  return normalizeWhitespace(value).slice(0, maxLength)
}

export function parseCurrencyAmount(value: RawTextValue) {
  const parsed = Number(value.trim())
  if (!Number.isFinite(parsed)) return null
  return parsed
}

export function clampRating(value: RawNumericValue, min = MIN_RATING, max = MAX_RATING) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.round(value)))
}

export function isValidBusinessTime(value: RawTextValue) {
  return DELIVERY_INPUT_PATTERNS.businessTime.test(value)
}

export function isValidContactPhone(value: RawTextValue) {
  return DELIVERY_INPUT_PATTERNS.contactPhone.test(value)
}

export function isValidBankAccountNumber(value: RawTextValue) {
  return DELIVERY_INPUT_PATTERNS.bankAccountNumber.test(value.trim())
}
