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
} from '@/shared/object'
import { request, uploadRequest } from '@/shared/api/http'
import { DELIVERY_API_ROUTE } from '@/shared/api/routes'

export function updateMerchantProfile(payload: UpdateMerchantProfileRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.merchantProfile, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function withdrawMerchantIncome(payload: WithdrawMerchantIncomeRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.merchantWithdraw, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitMerchantApplication(payload: MerchantRegistrationRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.merchantApplications, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function addStoreMenuItem(storeId: StoreId, payload: AddMenuItemRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.storeMenu(storeId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function removeStoreMenuItem(storeId: StoreId, menuItemId: MenuItemId) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.storeMenuItemRemove(storeId, menuItemId), {
    method: 'POST',
  })
}

export function updateStoreMenuItemStock(
  storeId: StoreId,
  menuItemId: MenuItemId,
  payload: UpdateMenuItemStockRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.storeMenuItemStock(storeId, menuItemId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStoreMenuItemPrice(
  storeId: StoreId,
  menuItemId: MenuItemId,
  payload: UpdateMenuItemPriceRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.storeMenuItemPrice(storeId, menuItemId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStoreOperationalInfo(
  storeId: StoreId,
  payload: UpdateStoreOperationalRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.storeOperations(storeId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function uploadMerchantStoreImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return uploadRequest<ImageUploadResponse>(DELIVERY_API_ROUTE.storeImageUpload, {
    method: 'POST',
    body: formData,
  })
}
