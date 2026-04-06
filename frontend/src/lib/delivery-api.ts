import type {
  AddCustomerAddressRequest,
  AddMenuItemRequest,
  AssignRiderRequest,
  AuthSession,
  CreateOrderRequest,
  DeliveryAppState,
  EligibilityReviewRequest,
  ImageUploadResponse,
  LoginRequest,
  MerchantRegistrationRequest,
  RechargeBalanceRequest,
  RejectOrderRequest,
  RemoveCustomerAddressRequest,
  RegisterRequest,
  ResolveEligibilityReviewRequest,
  ResolvePartialRefundRequest,
  ResolveReviewAppealRequest,
  ResolveTicketRequest,
  SendOrderChatMessageRequest,
  SetDefaultCustomerAddressRequest,
  SubmitAfterSalesRequest,
  UpdateMerchantProfileRequest,
  UpdateRiderProfileRequest,
  UpdateCustomerProfileRequest,
  ReviewAppealRequest,
  ReviewMerchantApplicationRequest,
  ReviewOrderRequest,
  SubmitPartialRefundRequest,
  WithdrawMerchantIncomeRequest,
  WithdrawRiderIncomeRequest,
  UpdateMenuItemStockRequest,
  UpdateStoreOperationalRequest,
} from '@/domain-types/delivery'

const SESSION_STORAGE_KEY = 'delivery-session-token'
const REQUEST_TIMEOUT_MS = 8000

function getSessionToken() {
  return window.localStorage.getItem(SESSION_STORAGE_KEY)
}

export function saveSessionToken(token: string) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, token)
}

export function clearSessionToken() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const sessionToken = getSessionToken()
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response

  try {
    response = await fetch(input, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('请求超时，请确认后端服务已启动在 http://127.0.0.1:8081')
    }

    throw new Error('无法连接后端服务，请确认后端运行在 http://127.0.0.1:8081')
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

async function uploadRequest<T>(input: string, init?: RequestInit): Promise<T> {
  const sessionToken = getSessionToken()
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response

  try {
    response = await fetch(input, {
      ...init,
      headers: {
        ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('上传超时，请确认后端服务已启动在 http://127.0.0.1:8081')
    }

    throw new Error('无法连接后端服务，请确认后端运行在 http://127.0.0.1:8081')
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export const deliveryApi = {
  login: (payload: LoginRequest) =>
    request<AuthSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: RegisterRequest) =>
    request<AuthSession>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getSession: () => request<AuthSession>('/api/auth/session'),
  logout: () =>
    request<void>('/api/auth/logout', {
      method: 'POST',
    }),
  getState: () => request<DeliveryAppState>('/api/delivery/state'),
  updateCustomerProfile: (customerId: string, payload: UpdateCustomerProfileRequest) =>
    request<DeliveryAppState>(`/api/delivery/customers/${customerId}/profile`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  addCustomerAddress: (customerId: string, payload: AddCustomerAddressRequest) =>
    request<DeliveryAppState>(`/api/delivery/customers/${customerId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  removeCustomerAddress: (customerId: string, payload: RemoveCustomerAddressRequest) =>
    request<DeliveryAppState>(`/api/delivery/customers/${customerId}/addresses/remove`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  setDefaultCustomerAddress: (customerId: string, payload: SetDefaultCustomerAddressRequest) =>
    request<DeliveryAppState>(`/api/delivery/customers/${customerId}/addresses/default`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  rechargeCustomerBalance: (customerId: string, payload: RechargeBalanceRequest) =>
    request<DeliveryAppState>(`/api/delivery/customers/${customerId}/recharge`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateMerchantProfile: (payload: UpdateMerchantProfileRequest) =>
    request<DeliveryAppState>('/api/delivery/merchant-profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateRiderProfile: (riderId: string, payload: UpdateRiderProfileRequest) =>
    request<DeliveryAppState>(`/api/delivery/riders/${riderId}/profile`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  withdrawMerchantIncome: (payload: WithdrawMerchantIncomeRequest) =>
    request<DeliveryAppState>('/api/delivery/merchant-profile/withdraw', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  withdrawRiderIncome: (riderId: string, payload: WithdrawRiderIncomeRequest) =>
    request<DeliveryAppState>(`/api/delivery/riders/${riderId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitMerchantApplication: (payload: MerchantRegistrationRequest) =>
    request<DeliveryAppState>('/api/delivery/merchant-applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  addStoreMenuItem: (storeId: string, payload: AddMenuItemRequest) =>
    request<DeliveryAppState>(`/api/delivery/stores/${storeId}/menu`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  removeStoreMenuItem: (storeId: string, menuItemId: string) =>
    request<DeliveryAppState>(`/api/delivery/stores/${storeId}/menu/${menuItemId}/remove`, {
      method: 'POST',
    }),
  updateStoreMenuItemStock: (
    storeId: string,
    menuItemId: string,
    payload: UpdateMenuItemStockRequest,
  ) =>
    request<DeliveryAppState>(`/api/delivery/stores/${storeId}/menu/${menuItemId}/stock`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateStoreOperationalInfo: (
    storeId: string,
    payload: UpdateStoreOperationalRequest,
  ) =>
    request<DeliveryAppState>(`/api/delivery/stores/${storeId}/operations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  uploadMerchantStoreImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return uploadRequest<ImageUploadResponse>('/api/delivery/uploads/store-image', {
      method: 'POST',
      body: formData,
    })
  },
  approveMerchantApplication: (
    applicationId: string,
    payload: ReviewMerchantApplicationRequest,
  ) =>
    request<DeliveryAppState>(`/api/delivery/merchant-applications/${applicationId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  rejectMerchantApplication: (
    applicationId: string,
    payload: ReviewMerchantApplicationRequest,
  ) =>
    request<DeliveryAppState>(`/api/delivery/merchant-applications/${applicationId}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitReviewAppeal: (orderId: string, payload: ReviewAppealRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/review-appeals`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  resolveReviewAppeal: (appealId: string, payload: ResolveReviewAppealRequest) =>
    request<DeliveryAppState>(`/api/delivery/review-appeals/${appealId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitEligibilityReview: (payload: EligibilityReviewRequest) =>
    request<DeliveryAppState>('/api/delivery/eligibility-reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  resolveEligibilityReview: (
    reviewId: string,
    payload: ResolveEligibilityReviewRequest,
  ) =>
    request<DeliveryAppState>(`/api/delivery/eligibility-reviews/${reviewId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createOrder: (payload: CreateOrderRequest) =>
    request<DeliveryAppState>('/api/delivery/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  acceptOrder: (orderId: string) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/accept`, {
      method: 'POST',
    }),
  rejectOrder: (orderId: string, payload: RejectOrderRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  readyOrder: (orderId: string) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/ready`, {
      method: 'POST',
    }),
  assignRider: (orderId: string, payload: AssignRiderRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/assign-rider`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  pickupOrder: (orderId: string) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/pickup`, {
      method: 'POST',
    }),
  deliverOrder: (orderId: string) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/deliver`, {
      method: 'POST',
    }),
  reviewOrder: (orderId: string, payload: ReviewOrderRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  sendOrderChatMessage: (orderId: string, payload: SendOrderChatMessageRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/chat`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitPartialRefundRequest: (orderId: string, payload: SubmitPartialRefundRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/partial-refunds`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  resolvePartialRefundRequest: (refundId: string, payload: ResolvePartialRefundRequest) =>
    request<DeliveryAppState>(`/api/delivery/partial-refunds/${refundId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  resolveTicket: (orderId: string, payload: ResolveTicketRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitAfterSalesRequest: (orderId: string, payload: SubmitAfterSalesRequest) =>
    request<DeliveryAppState>(`/api/delivery/orders/${orderId}/after-sales`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
