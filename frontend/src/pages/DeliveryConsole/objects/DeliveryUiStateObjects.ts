export const HEADER_ACTION = {
  refresh: 'refresh',
  logout: 'logout',
} as const

export type HeaderAction = (typeof HEADER_ACTION)[keyof typeof HEADER_ACTION] | null

export const FEEDBACK_TONE = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
} as const

export type FeedbackTone = (typeof FEEDBACK_TONE)[keyof typeof FEEDBACK_TONE]

export const FEEDBACK_PREFIX = {
  [FEEDBACK_TONE.error]: '__error__:',
  [FEEDBACK_TONE.info]: '__info__:',
  [FEEDBACK_TONE.success]: '__success__:',
  [FEEDBACK_TONE.warning]: '__warning__:',
} as const
