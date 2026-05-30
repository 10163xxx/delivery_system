import type {
  RiderId,
  UpdateRiderProfileRequest,
} from '@/objects/core/SharedObjects'
import { updateRiderProfileApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function updateRiderProfile(riderId: RiderId, payload: UpdateRiderProfileRequest) {
  return postNormalizedDeliveryState(buildApiPath1(updateRiderProfileApiDefinition, riderId), payload)
}
