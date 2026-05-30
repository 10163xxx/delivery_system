import type { PhoneNumber } from '@/objects/domain/DomainObjects'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'

export type UpdateMerchantProfileRequest = {
  contactPhone: PhoneNumber
  payoutAccount: MerchantPayoutAccount
}
