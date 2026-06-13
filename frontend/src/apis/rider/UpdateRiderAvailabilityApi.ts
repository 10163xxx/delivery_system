import type { DeliveryAppState, RiderId, UpdateRiderAvailabilityRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateRiderAvailabilityApiDefinition = defineJsonPostApi1<RiderId, UpdateRiderAvailabilityRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('riders')],
    [routeSegment('availability')],
  )

export function updateRiderAvailability(
  riderId: RiderId,
  payload: UpdateRiderAvailabilityRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateRiderAvailabilityApiDefinition, riderId), payload)
}
