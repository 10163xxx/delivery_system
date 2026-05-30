export const DELIVERY_INPUT_PATTERNS = {
  businessTime: /^([01]\d|2[0-3]):[0-5]\d$/,
  contactPhone: /^1\d{10}$/,
  bankAccountNumber: /^\d{10,30}$/,
} as const

export const DELIVERY_DATE_TIME_FORMAT = {
  locale: 'zh-CN',
  twoDigit: '2-digit',
  numeric: 'numeric',
  partWidth: 2,
  zeroPad: '0',
} as const
