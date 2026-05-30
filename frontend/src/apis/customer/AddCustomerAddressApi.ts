import type {
  AddCustomerAddressRequest,
  CustomerId,
} from '@/objects/core/SharedObjects'
import { addCustomerAddressApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function addCustomerAddress(customerId: CustomerId, payload: AddCustomerAddressRequest) {
  return postNormalizedDeliveryState(buildApiPath1(addCustomerAddressApiDefinition, customerId), payload)
}
