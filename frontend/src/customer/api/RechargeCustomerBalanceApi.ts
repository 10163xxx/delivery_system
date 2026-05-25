import type {
  CustomerId,
  RechargeBalanceRequest,
} from '@/shared/object/core/SharedObjects'
import { rechargeCustomerBalanceApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function rechargeCustomerBalance(
  customerId: CustomerId,
  payload: RechargeBalanceRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(rechargeCustomerBalanceApiDefinition, customerId), payload)
}
