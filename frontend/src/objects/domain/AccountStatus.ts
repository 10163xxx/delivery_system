export const ACCOUNT_STATUS = {
  active: 'Active',
  suspended: 'Suspended',
} as const

export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS]
