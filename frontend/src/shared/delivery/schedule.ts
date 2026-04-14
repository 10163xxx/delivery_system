import { STORE_STATUS, type BusinessHours, type Store } from '@/shared/object'
import { MIN_SCHEDULE_LEAD_MINUTES } from './constants'
import { DELIVERY_CONSOLE_MESSAGES } from './messages'
import { isValidBusinessTime } from './shared'

function padDateTimePart(value: number) {
  return String(value).padStart(2, '0')
}

function businessTimeToMinutes(value: string) {
  if (!isValidBusinessTime(value)) return Number.NaN
  const [hours, minutes] = value.split(':').map(Number)
  if (hours == null || minutes == null) return Number.NaN
  return hours * 60 + minutes
}

export function validateBusinessHours(businessHours: BusinessHours) {
  if (!isValidBusinessTime(businessHours.openTime) || !isValidBusinessTime(businessHours.closeTime)) {
    return DELIVERY_CONSOLE_MESSAGES.businessHoursInvalid
  }

  if (businessTimeToMinutes(businessHours.openTime) >= businessTimeToMinutes(businessHours.closeTime)) {
    return DELIVERY_CONSOLE_MESSAGES.businessHoursOrderInvalid
  }

  return undefined
}

export function formatBusinessHours(businessHours: BusinessHours) {
  return `${businessHours.openTime} - ${businessHours.closeTime}`
}

export function isStoreCurrentlyOpen(store: Store, currentTime = new Date()) {
  if (store.status === STORE_STATUS.revoked) return false
  const minutes = currentTime.getHours() * 60 + currentTime.getMinutes()
  const openMinutes = businessTimeToMinutes(store.businessHours.openTime)
  const closeMinutes = businessTimeToMinutes(store.businessHours.closeTime)
  if (!Number.isFinite(openMinutes) || !Number.isFinite(closeMinutes)) return false
  return minutes >= openMinutes && minutes < closeMinutes
}

function toDateTimeLocalValue(date: Date) {
  return `${date.getFullYear()}-${padDateTimePart(date.getMonth() + 1)}-${padDateTimePart(date.getDate())}T${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`
}

export function formatDateTimeLocalValue(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

function ceilToMinute(date: Date) {
  const next = new Date(date)
  if (next.getSeconds() === 0 && next.getMilliseconds() === 0) return next
  next.setSeconds(0, 0)
  next.setMinutes(next.getMinutes() + 1)
  return next
}

export function getTodayDeliveryWindow(now = new Date()) {
  const minimum = ceilToMinute(new Date(now.getTime() + MIN_SCHEDULE_LEAD_MINUTES * 60 * 1000))
  const cutoff = new Date(now)
  cutoff.setHours(23, 59, 0, 0)

  return {
    minimum,
    cutoff,
    isAvailable: minimum.getTime() <= cutoff.getTime(),
    minimumValue: toDateTimeLocalValue(minimum),
    cutoffValue: toDateTimeLocalValue(cutoff),
  }
}

function normalizeScheduledDeliveryAt(value: string) {
  if (!value) return ''
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
}

export function validateScheduledDeliveryTime(value: string, now = new Date()) {
  if (!value) return DELIVERY_CONSOLE_MESSAGES.deliveryTimeRequired
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return DELIVERY_CONSOLE_MESSAGES.deliveryTimeFormatInvalid
  const { minimum, cutoff } = getTodayDeliveryWindow(now)
  if (parsed.getTime() < minimum.getTime()) return DELIVERY_CONSOLE_MESSAGES.deliveryTimeTooEarly
  if (parsed.getTime() > cutoff.getTime()) return DELIVERY_CONSOLE_MESSAGES.deliveryTimeOutOfRange
  if (parsed.toDateString() !== now.toDateString()) return DELIVERY_CONSOLE_MESSAGES.deliveryTimeTodayOnly
  return null
}

export function buildScheduledDeliveryAt(value: string) {
  return normalizeScheduledDeliveryAt(value)
}
