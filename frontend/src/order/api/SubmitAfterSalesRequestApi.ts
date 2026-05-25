import type {
  OrderId,
  SubmitAfterSalesRequest,
} from '@/shared/object/core/SharedObjects'
import { submitAfterSalesRequestApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function submitAfterSalesRequest(
  orderId: OrderId,
  payload: SubmitAfterSalesRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(submitAfterSalesRequestApiDefinition, orderId), payload)
}
