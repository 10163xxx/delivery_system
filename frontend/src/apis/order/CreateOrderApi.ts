import type { CreateOrderRequest, DeliveryAppState } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const createOrderApiDefinition = defineJsonPostApi0<CreateOrderRequest, DeliveryAppState>([
  routeSegment('api'),
  routeSegment('delivery'),
  routeSegment('orders'),
])

export function createOrder(payload: CreateOrderRequest) {
  return postNormalizedDeliveryState(createOrderApiDefinition, payload)
}
