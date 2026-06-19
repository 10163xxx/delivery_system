// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { PhoneNumber } from '@/objects/core/SharedObjects'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'

export type UpdateMerchantProfileRequest = {
  contactPhone: PhoneNumber
  payoutAccount: MerchantPayoutAccount
}
