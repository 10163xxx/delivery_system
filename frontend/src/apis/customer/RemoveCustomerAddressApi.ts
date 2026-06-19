// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { CustomerId, DeliveryAppState, RemoveCustomerAddressRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const removeCustomerAddressApiDefinition = defineJsonPostApi1<CustomerId, RemoveCustomerAddressRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('customers')],
    [routeSegment('addresses'), routeSegment('remove')],
  )

export function removeCustomerAddress(
  customerId: CustomerId,
  payload: RemoveCustomerAddressRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(removeCustomerAddressApiDefinition, customerId), payload)
}
