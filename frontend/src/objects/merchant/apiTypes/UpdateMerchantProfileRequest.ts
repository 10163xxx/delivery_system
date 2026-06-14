import type { PhoneNumber } from '@/objects/core/SharedObjects'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'

export type UpdateMerchantProfileRequest = {
  contactPhone: PhoneNumber
  payoutAccount: MerchantPayoutAccount
}
