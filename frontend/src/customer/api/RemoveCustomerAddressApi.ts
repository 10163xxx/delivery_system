import type {
  CustomerId,
  RemoveCustomerAddressRequest,
} from '@/shared/object/core/SharedObjects'
import { removeCustomerAddressApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function removeCustomerAddress(
  customerId: CustomerId,
  payload: RemoveCustomerAddressRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(removeCustomerAddressApiDefinition, customerId), payload)
}
