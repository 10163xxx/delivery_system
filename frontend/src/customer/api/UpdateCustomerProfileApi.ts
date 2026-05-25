import type {
  CustomerId,
  UpdateCustomerProfileRequest,
} from '@/shared/object/core/SharedObjects'
import { updateCustomerProfileApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function updateCustomerProfile(
  customerId: CustomerId,
  payload: UpdateCustomerProfileRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateCustomerProfileApiDefinition, customerId), payload)
}
