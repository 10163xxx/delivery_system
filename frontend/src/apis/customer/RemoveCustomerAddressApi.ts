import type {
  CustomerId,
  RemoveCustomerAddressRequest,
} from '@/objects/core/SharedObjects'
import { removeCustomerAddressApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function removeCustomerAddress(
  customerId: CustomerId,
  payload: RemoveCustomerAddressRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(removeCustomerAddressApiDefinition, customerId), payload)
}
