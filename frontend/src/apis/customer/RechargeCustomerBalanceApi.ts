import type {
  CustomerId,
  RechargeBalanceRequest,
} from '@/objects/core/SharedObjects'
import { rechargeCustomerBalanceApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function rechargeCustomerBalance(
  customerId: CustomerId,
  payload: RechargeBalanceRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(rechargeCustomerBalanceApiDefinition, customerId), payload)
}
