import type { DeliveryAppState, OrderId, SubmitAfterSalesRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const submitAfterSalesRequestApiDefinition = defineJsonPostApi1<OrderId, SubmitAfterSalesRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('afterSales')],
  )

export function submitAfterSalesRequest(
  orderId: OrderId,
  payload: SubmitAfterSalesRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(submitAfterSalesRequestApiDefinition, orderId), payload)
}
