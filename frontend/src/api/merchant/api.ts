import type {
  AddMenuItemRequest,
  DeliveryAppState,
  ImageUploadResponse,
  MenuItemId,
  MerchantRegistrationRequest,
  MerchantApplicationId,
  ReviewMerchantApplicationRequest,
  RiderId,
  StoreId,
  UpdateMenuItemStockRequest,
  UpdateMerchantProfileRequest,
  UpdateStoreOperationalRequest,
  UpdateRiderProfileRequest,
  WithdrawMerchantIncomeRequest,
  WithdrawRiderIncomeRequest,
} from '@/domain'
import { request, uploadRequest } from '@/api/shared/http'

export function updateMerchantProfile(payload: UpdateMerchantProfileRequest) {
  return request<DeliveryAppState>('/api/delivery/merchant-profile', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateRiderProfile(riderId: RiderId, payload: UpdateRiderProfileRequest) {
  return request<DeliveryAppState>(`/api/delivery/riders/${riderId}/profile`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function withdrawMerchantIncome(payload: WithdrawMerchantIncomeRequest) {
  return request<DeliveryAppState>('/api/delivery/merchant-profile/withdraw', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function withdrawRiderIncome(riderId: RiderId, payload: WithdrawRiderIncomeRequest) {
  return request<DeliveryAppState>(`/api/delivery/riders/${riderId}/withdraw`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitMerchantApplication(payload: MerchantRegistrationRequest) {
  return request<DeliveryAppState>('/api/delivery/merchant-applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function addStoreMenuItem(storeId: StoreId, payload: AddMenuItemRequest) {
  return request<DeliveryAppState>(`/api/delivery/stores/${storeId}/menu`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function removeStoreMenuItem(storeId: StoreId, menuItemId: MenuItemId) {
  return request<DeliveryAppState>(`/api/delivery/stores/${storeId}/menu/${menuItemId}/remove`, {
    method: 'POST',
  })
}

export function updateStoreMenuItemStock(
  storeId: StoreId,
  menuItemId: MenuItemId,
  payload: UpdateMenuItemStockRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/stores/${storeId}/menu/${menuItemId}/stock`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStoreOperationalInfo(
  storeId: StoreId,
  payload: UpdateStoreOperationalRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/stores/${storeId}/operations`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function uploadMerchantStoreImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return uploadRequest<ImageUploadResponse>('/api/delivery/uploads/store-image', {
    method: 'POST',
    body: formData,
  })
}

export function approveMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/merchant-applications/${applicationId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function rejectMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/merchant-applications/${applicationId}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
