import type { WithdrawMerchantIncomeRequest } from '@/objects/core/SharedObjects'
import { withdrawMerchantIncomeApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'

export function withdrawMerchantIncome(payload: WithdrawMerchantIncomeRequest) {
  return postNormalizedDeliveryState(withdrawMerchantIncomeApiDefinition, payload)
}
