import { PAYOUT_ACCOUNT_TYPE } from '@/objects/core/SharedObjects'

export type MerchantPayoutAccountType =
  (typeof PAYOUT_ACCOUNT_TYPE)[keyof typeof PAYOUT_ACCOUNT_TYPE]
