import type {
  AddCustomerAddressRequest,
  CustomerId,
  DeliveryAppState,
  RechargeBalanceRequest,
  RemoveCustomerAddressRequest,
  SetDefaultCustomerAddressRequest,
  UpdateCustomerProfileRequest,
} from '@/domain'
import { request } from '@/api/shared/http'

export function getState() {
  return request<DeliveryAppState>('/api/delivery/state')
}

export function updateCustomerProfile(
  customerId: CustomerId,
  payload: UpdateCustomerProfileRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/customers/${customerId}/profile`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function addCustomerAddress(customerId: CustomerId, payload: AddCustomerAddressRequest) {
  return request<DeliveryAppState>(`/api/delivery/customers/${customerId}/addresses`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function removeCustomerAddress(
  customerId: CustomerId,
  payload: RemoveCustomerAddressRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/customers/${customerId}/addresses/remove`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function setDefaultCustomerAddress(
  customerId: CustomerId,
  payload: SetDefaultCustomerAddressRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/customers/${customerId}/addresses/default`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function rechargeCustomerBalance(
  customerId: CustomerId,
  payload: RechargeBalanceRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/customers/${customerId}/recharge`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
