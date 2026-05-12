import type {
  AddCustomerAddressRequest,
  CustomerId,
  DeliveryAppState,
  RechargeBalanceRequest,
  RemoveCustomerAddressRequest,
  SetDefaultCustomerAddressRequest,
  UpdateCustomerProfileRequest,
} from '@/shared/object/core/SharedObjects'
import {
  defineJsonGetEndpoint,
  defineJsonPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import { normalizeDeliveryState } from '@/shared/api/DeliveryStateNormalizer'
import {
  DELIVERY_STATE_API_ROUTE,
  getCustomerAddressDefaultApiRoute,
  getCustomerAddressRemoveApiRoute,
  getCustomerAddressesApiRoute,
  getCustomerProfileApiRoute,
  getCustomerRechargeApiRoute,
} from '@/shared/api/ApiRoutes'

const DELIVERY_STATE_ENDPOINT = defineJsonGetEndpoint<DeliveryAppState>(DELIVERY_STATE_API_ROUTE)

export const customerApi = {
  getState() {
    return httpClient.getJson(DELIVERY_STATE_ENDPOINT).then(normalizeDeliveryState)
  },
  updateCustomerProfile(customerId: CustomerId, payload: UpdateCustomerProfileRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<UpdateCustomerProfileRequest, DeliveryAppState>(
        getCustomerProfileApiRoute(customerId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  addCustomerAddress(customerId: CustomerId, payload: AddCustomerAddressRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<AddCustomerAddressRequest, DeliveryAppState>(
        getCustomerAddressesApiRoute(customerId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  removeCustomerAddress(customerId: CustomerId, payload: RemoveCustomerAddressRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<RemoveCustomerAddressRequest, DeliveryAppState>(
        getCustomerAddressRemoveApiRoute(customerId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  setDefaultCustomerAddress(
    customerId: CustomerId,
    payload: SetDefaultCustomerAddressRequest,
  ) {
    return httpClient.postJson(
      defineJsonPostEndpoint<SetDefaultCustomerAddressRequest, DeliveryAppState>(
        getCustomerAddressDefaultApiRoute(customerId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  rechargeCustomerBalance(customerId: CustomerId, payload: RechargeBalanceRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<RechargeBalanceRequest, DeliveryAppState>(
        getCustomerRechargeApiRoute(customerId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
}

export const {
  getState,
  updateCustomerProfile,
  addCustomerAddress,
  removeCustomerAddress,
  setDefaultCustomerAddress,
  rechargeCustomerBalance,
} = customerApi
