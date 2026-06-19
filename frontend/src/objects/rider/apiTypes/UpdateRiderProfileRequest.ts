// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'

export type UpdateRiderProfileRequest = {
  payoutAccount: MerchantPayoutAccount
}
