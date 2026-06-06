import type {
  CustomerId,
  UpdateCustomerProfileRequest,
} from '@/objects/core/SharedObjects'
import { updateCustomerProfileApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function updateCustomerProfile(
  customerId: CustomerId,
  payload: UpdateCustomerProfileRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateCustomerProfileApiDefinition, customerId), payload)
}
