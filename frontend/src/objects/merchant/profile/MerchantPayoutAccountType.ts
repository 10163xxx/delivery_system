export const PAYOUT_ACCOUNT_TYPE = {
  alipay: 'alipay',
  bank: 'bank',
} as const

export type MerchantPayoutAccountType =
  (typeof PAYOUT_ACCOUNT_TYPE)[keyof typeof PAYOUT_ACCOUNT_TYPE]
