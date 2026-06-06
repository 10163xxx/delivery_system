import type {
  OrderId,
  SubmitAfterSalesRequest,
} from '@/objects/core/SharedObjects'
import { submitAfterSalesRequestApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function submitAfterSalesRequest(
  orderId: OrderId,
  payload: SubmitAfterSalesRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(submitAfterSalesRequestApiDefinition, orderId), payload)
}
