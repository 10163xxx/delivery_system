import type { DeliveryAppState } from '@/objects/core/SharedObjects'
import { getNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { defineJsonGetApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const getStateApiDefinition = defineJsonGetApi0<DeliveryAppState>([
  routeSegment('api'),
  routeSegment('delivery'),
  routeSegment('state'),
])

export function getState() {
  return getNormalizedDeliveryState(getStateApiDefinition)
}
