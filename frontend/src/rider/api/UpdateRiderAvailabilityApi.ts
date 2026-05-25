import type {
  RiderId,
  UpdateRiderAvailabilityRequest,
} from '@/shared/object/core/SharedObjects'
import { updateRiderAvailabilityApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function updateRiderAvailability(
  riderId: RiderId,
  payload: UpdateRiderAvailabilityRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateRiderAvailabilityApiDefinition, riderId), payload)
}
