import type {
  AddCustomerAddressRequest,
  CustomerId,
} from '@/shared/object/core/SharedObjects'
import { addCustomerAddressApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function addCustomerAddress(customerId: CustomerId, payload: AddCustomerAddressRequest) {
  return postNormalizedDeliveryState(buildApiPath1(addCustomerAddressApiDefinition, customerId), payload)
}
