import type {
  AddCustomerAddressRequest,
  CustomerId,
  DeliveryAppState,
  RechargeBalanceRequest,
  RemoveCustomerAddressRequest,
  SetDefaultCustomerAddressRequest,
  UpdateCustomerProfileRequest,
} from '@/shared/object'
import { request } from '@/shared/api/http'
import { DELIVERY_API_ROUTE } from '@/shared/api/routes'

export function getState() {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.state)
}

export function updateCustomerProfile(
  customerId: CustomerId,
  payload: UpdateCustomerProfileRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.customerProfile(customerId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function addCustomerAddress(customerId: CustomerId, payload: AddCustomerAddressRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.customerAddresses(customerId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function removeCustomerAddress(
  customerId: CustomerId,
  payload: RemoveCustomerAddressRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.customerAddressRemove(customerId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function setDefaultCustomerAddress(
  customerId: CustomerId,
  payload: SetDefaultCustomerAddressRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.customerAddressDefault(customerId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function rechargeCustomerBalance(
  customerId: CustomerId,
  payload: RechargeBalanceRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.customerRecharge(customerId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
