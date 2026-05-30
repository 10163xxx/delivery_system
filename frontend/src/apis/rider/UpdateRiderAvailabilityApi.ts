import type {
  RiderId,
  UpdateRiderAvailabilityRequest,
} from '@/objects/core/SharedObjects'
import { updateRiderAvailabilityApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function updateRiderAvailability(
  riderId: RiderId,
  payload: UpdateRiderAvailabilityRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateRiderAvailabilityApiDefinition, riderId), payload)
}
