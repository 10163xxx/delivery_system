import type { WithdrawMerchantIncomeRequest } from '@/shared/object/core/SharedObjects'
import { withdrawMerchantIncomeApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'

export function withdrawMerchantIncome(payload: WithdrawMerchantIncomeRequest) {
  return postNormalizedDeliveryState(withdrawMerchantIncomeApiDefinition, payload)
}
