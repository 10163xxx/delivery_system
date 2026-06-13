import type { CustomerId, DeliveryAppState, SetDefaultCustomerAddressRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const setDefaultCustomerAddressApiDefinition = defineJsonPostApi1<CustomerId, SetDefaultCustomerAddressRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('customers')],
    [routeSegment('addresses'), routeSegment('default')],
  )

export function setDefaultCustomerAddress(
  customerId: CustomerId,
  payload: SetDefaultCustomerAddressRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(setDefaultCustomerAddressApiDefinition, customerId), payload)
}
