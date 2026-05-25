import type { CreateOrderRequest } from '@/shared/object/core/SharedObjects'
import { createOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'

export function createOrder(payload: CreateOrderRequest) {
  return postNormalizedDeliveryState(createOrderApiDefinition, payload)
}
