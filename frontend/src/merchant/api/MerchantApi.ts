import type {
  AddMenuItemRequest,
  DeliveryAppState,
  ImageUploadResponse,
  MenuItemId,
  MerchantRegistrationRequest,
  StoreId,
  UpdateMenuItemPriceRequest,
  UpdateMenuItemStockRequest,
  UpdateMerchantProfileRequest,
  UpdateStoreOperationalRequest,
  WithdrawMerchantIncomeRequest,
} from '@/shared/object/core/SharedObjects'
import {
  defineJsonPostEndpoint,
  defineUploadPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import { normalizeDeliveryState } from '@/shared/api/DeliveryStateNormalizer'
import {
  DELIVERY_MERCHANT_APPLICATIONS_API_ROUTE,
  DELIVERY_MERCHANT_PROFILE_API_ROUTE,
  DELIVERY_MERCHANT_WITHDRAW_API_ROUTE,
  DELIVERY_STORE_IMAGE_UPLOAD_API_ROUTE,
  getStoreMenuApiRoute,
  getStoreMenuItemPriceApiRoute,
  getStoreMenuItemRemoveApiRoute,
  getStoreMenuItemStockApiRoute,
  getStoreOperationsApiRoute,
} from '@/shared/api/ApiRoutes'

const DELIVERY_MERCHANT_PROFILE_ENDPOINT =
  defineJsonPostEndpoint<UpdateMerchantProfileRequest, DeliveryAppState>(
    DELIVERY_MERCHANT_PROFILE_API_ROUTE,
  )
const DELIVERY_MERCHANT_WITHDRAW_ENDPOINT =
  defineJsonPostEndpoint<WithdrawMerchantIncomeRequest, DeliveryAppState>(
    DELIVERY_MERCHANT_WITHDRAW_API_ROUTE,
  )
const DELIVERY_MERCHANT_APPLICATIONS_ENDPOINT =
  defineJsonPostEndpoint<MerchantRegistrationRequest, DeliveryAppState>(
    DELIVERY_MERCHANT_APPLICATIONS_API_ROUTE,
  )
const DELIVERY_STORE_IMAGE_UPLOAD_ENDPOINT =
  defineUploadPostEndpoint<ImageUploadResponse>(DELIVERY_STORE_IMAGE_UPLOAD_API_ROUTE)

export const merchantApi = {
  updateMerchantProfile(payload: UpdateMerchantProfileRequest) {
    return httpClient.postJson(DELIVERY_MERCHANT_PROFILE_ENDPOINT, payload).then(normalizeDeliveryState)
  },
  withdrawMerchantIncome(payload: WithdrawMerchantIncomeRequest) {
    return httpClient.postJson(DELIVERY_MERCHANT_WITHDRAW_ENDPOINT, payload).then(normalizeDeliveryState)
  },
  submitMerchantApplication(payload: MerchantRegistrationRequest) {
    return httpClient.postJson(DELIVERY_MERCHANT_APPLICATIONS_ENDPOINT, payload).then(normalizeDeliveryState)
  },
  addStoreMenuItem(storeId: StoreId, payload: AddMenuItemRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<AddMenuItemRequest, DeliveryAppState>(getStoreMenuApiRoute(storeId)),
      payload,
    ).then(normalizeDeliveryState)
  },
  removeStoreMenuItem(storeId: StoreId, menuItemId: MenuItemId) {
    return httpClient.postWithoutBody(
      defineJsonPostEndpoint<void, DeliveryAppState>(
        getStoreMenuItemRemoveApiRoute(storeId, menuItemId),
      ),
    ).then(normalizeDeliveryState)
  },
  updateStoreMenuItemStock(
    storeId: StoreId,
    menuItemId: MenuItemId,
    payload: UpdateMenuItemStockRequest,
  ) {
    return httpClient.postJson(
      defineJsonPostEndpoint<UpdateMenuItemStockRequest, DeliveryAppState>(
        getStoreMenuItemStockApiRoute(storeId, menuItemId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  updateStoreMenuItemPrice(
    storeId: StoreId,
    menuItemId: MenuItemId,
    payload: UpdateMenuItemPriceRequest,
  ) {
    return httpClient.postJson(
      defineJsonPostEndpoint<UpdateMenuItemPriceRequest, DeliveryAppState>(
        getStoreMenuItemPriceApiRoute(storeId, menuItemId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  updateStoreOperationalInfo(storeId: StoreId, payload: UpdateStoreOperationalRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<UpdateStoreOperationalRequest, DeliveryAppState>(
        getStoreOperationsApiRoute(storeId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  uploadMerchantStoreImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.postFormData(DELIVERY_STORE_IMAGE_UPLOAD_ENDPOINT, formData)
  },
}

export const {
  updateMerchantProfile,
  withdrawMerchantIncome,
  submitMerchantApplication,
  addStoreMenuItem,
  removeStoreMenuItem,
  updateStoreMenuItemStock,
  updateStoreMenuItemPrice,
  updateStoreOperationalInfo,
  uploadMerchantStoreImage,
} = merchantApi
