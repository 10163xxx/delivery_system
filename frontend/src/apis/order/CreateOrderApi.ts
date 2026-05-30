import type { CreateOrderRequest } from '@/objects/core/SharedObjects'
import { createOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'

export function createOrder(payload: CreateOrderRequest) {
  return postNormalizedDeliveryState(createOrderApiDefinition, payload)
}
