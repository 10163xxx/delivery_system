import type { CustomerId, DeliveryAppState, UpdateCustomerProfileRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateCustomerProfileApiDefinition = defineJsonPostApi1<CustomerId, UpdateCustomerProfileRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('customers')],
    [routeSegment('profile')],
  )

export function updateCustomerProfile(
  customerId: CustomerId,
  payload: UpdateCustomerProfileRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateCustomerProfileApiDefinition, customerId), payload)
}
