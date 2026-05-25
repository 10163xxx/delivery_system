import type {
  CustomerId,
  SetDefaultCustomerAddressRequest,
} from '@/shared/object/core/SharedObjects'
import { setDefaultCustomerAddressApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function setDefaultCustomerAddress(
  customerId: CustomerId,
  payload: SetDefaultCustomerAddressRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(setDefaultCustomerAddressApiDefinition, customerId), payload)
}
