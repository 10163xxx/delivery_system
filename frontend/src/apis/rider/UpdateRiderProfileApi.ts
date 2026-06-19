// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, RiderId, UpdateRiderProfileRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateRiderProfileApiDefinition = defineJsonPostApi1<RiderId, UpdateRiderProfileRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('riders')],
    [routeSegment('profile')],
  )

export function updateRiderProfile(riderId: RiderId, payload: UpdateRiderProfileRequest) {
  return postNormalizedDeliveryState(buildApiPath1(updateRiderProfileApiDefinition, riderId), payload)
}
