// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const PAYOUT_ACCOUNT_TYPE = {
  alipay: 'alipay',
  bank: 'bank',
} as const

export type MerchantPayoutAccountType =
  (typeof PAYOUT_ACCOUNT_TYPE)[keyof typeof PAYOUT_ACCOUNT_TYPE]
