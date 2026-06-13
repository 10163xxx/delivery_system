import type { AddCustomerAddressRequest, CustomerId, DeliveryAppState } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const addCustomerAddressApiDefinition = defineJsonPostApi1<CustomerId, AddCustomerAddressRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('customers')],
    [routeSegment('addresses')],
  )

export function addCustomerAddress(customerId: CustomerId, payload: AddCustomerAddressRequest) {
  return postNormalizedDeliveryState(buildApiPath1(addCustomerAddressApiDefinition, customerId), payload)
}
