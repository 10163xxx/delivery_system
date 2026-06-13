import type { CustomerId, DeliveryAppState, RechargeBalanceRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const rechargeCustomerBalanceApiDefinition = defineJsonPostApi1<CustomerId, RechargeBalanceRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('customers')],
    [routeSegment('recharge')],
  )

export function rechargeCustomerBalance(
  customerId: CustomerId,
  payload: RechargeBalanceRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(rechargeCustomerBalanceApiDefinition, customerId), payload)
}
