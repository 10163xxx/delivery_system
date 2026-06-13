import type { DeliveryAppState, WithdrawMerchantIncomeRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const withdrawMerchantIncomeApiDefinition = defineJsonPostApi0<WithdrawMerchantIncomeRequest, DeliveryAppState>([
    routeSegment('api'),
    routeSegment('delivery'),
    routeSegment('merchant-profile'),
    routeSegment('withdraw'),
  ])

export function withdrawMerchantIncome(payload: WithdrawMerchantIncomeRequest) {
  return postNormalizedDeliveryState(withdrawMerchantIncomeApiDefinition, payload)
}
