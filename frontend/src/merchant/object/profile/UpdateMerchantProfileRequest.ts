import type { PhoneNumber } from '@/shared/object/domain/DomainObjects'
import type { MerchantPayoutAccount } from '@/merchant/object/profile/MerchantPayoutAccount'

export type UpdateMerchantProfileRequest = {
  contactPhone: PhoneNumber
  payoutAccount: MerchantPayoutAccount
}
