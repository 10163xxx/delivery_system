import type {
  CustomerId,
  SetDefaultCustomerAddressRequest,
} from '@/objects/core/SharedObjects'
import { setDefaultCustomerAddressApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function setDefaultCustomerAddress(
  customerId: CustomerId,
  payload: SetDefaultCustomerAddressRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(setDefaultCustomerAddressApiDefinition, customerId), payload)
}
