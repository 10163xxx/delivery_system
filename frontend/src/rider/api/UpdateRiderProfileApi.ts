import type {
  RiderId,
  UpdateRiderProfileRequest,
} from '@/shared/object/core/SharedObjects'
import { updateRiderProfileApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function updateRiderProfile(riderId: RiderId, payload: UpdateRiderProfileRequest) {
  return postNormalizedDeliveryState(buildApiPath1(updateRiderProfileApiDefinition, riderId), payload)
}
