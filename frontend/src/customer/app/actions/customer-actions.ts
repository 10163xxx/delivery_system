import type { OrderSummary } from '@/shared/object'
import {
  AFTER_SALES_REQUEST_TYPE,
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_TARGET,
  ROUTE_PATH,
} from '@/shared/object'
import {
  addCustomerAddress as addCustomerAddressRequest,
  createOrder as createOrderRequest,
  rechargeCustomerBalance as rechargeCustomerBalanceRequest,
  removeCustomerAddress as removeCustomerAddressRequest,
  reviewOrder as reviewOrderRequest,
  sendOrderChatMessage as sendOrderChatMessageRequest,
  setDefaultCustomerAddress as setDefaultCustomerAddressRequest,
  submitAfterSalesRequest as submitAfterSalesRequestCall,
  submitPartialRefundRequest as submitPartialRefundRequestCall,
  updateCustomerProfile as updateCustomerProfileRequest,
} from '@/shared/api'
import {
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  DEFAULT_RECHARGE_PRESET_INDEX,
  MAX_RECHARGE_AMOUNT_YUAN,
  RECHARGE_PRESET_AMOUNTS,
  buildAfterSalesPayload,
  buildCustomerAddressPayload,
  buildCustomerProfilePayload,
  buildOrderChatPayload,
  buildOrderPayload,
  buildPartialRefundPayload,
  buildRechargePayload,
  buildReviewPayload,
  canReviewOrder,
  createInitialAfterSalesDraft,
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatMaxPartialRefundQuantityMessage,
  formatStoreClosedMessage,
  formatBusinessHours,
  getInitialQuantities,
  getTodayDeliveryWindow,
  hasPendingRiderReview,
  parseRechargeAmount,
  validateCustomerAddressDraft,
  validateScheduledDeliveryTime,
} from '@/shared/delivery'
import type { CustomerActionParams } from '@/customer/app/actions/customer-actions.types'

function removeKey<T>(record: Record<string, T>, key: string) {
  const next = { ...record }
  delete next[key]
  return next
}

function persistCustomerStoreSearchHistory(next: string[]) {
  if (next.length === 0) {
    window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
    return
  }

  window.localStorage.setItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY, JSON.stringify(next))
}

type CustomerOrderParams = Pick<
  CustomerActionParams,
  | 'state'
  | 'selectedStore'
  | 'selectedStoreIsOpen'
  | 'selectedCustomer'
  | 'selectedCoupon'
  | 'quantities'
  | 'deliveryAddress'
  | 'scheduledDeliveryTime'
  | 'scheduledDeliveryTouched'
  | 'remark'
  | 'payableTotalCents'
  | 'orderChatDrafts'
  | 'runAction'
  | 'navigate'
  | 'setDeliveryAddressError'
  | 'setScheduledDeliveryError'
  | 'setScheduledDeliveryTime'
  | 'setScheduledDeliveryTouched'
  | 'setRemark'
  | 'setQuantities'
  | 'setIsCheckoutExpanded'
  | 'setSelectedCouponId'
  | 'setError'
  | 'setOrderChatErrors'
  | 'setOrderChatDrafts'
>

type CustomerSupportParams = Pick<
  CustomerActionParams,
  | 'state'
  | 'partialRefundDrafts'
  | 'afterSalesDrafts'
  | 'reviewDrafts'
  | 'runAction'
  | 'navigate'
  | 'setPartialRefundErrors'
  | 'setPartialRefundDrafts'
  | 'setAfterSalesErrors'
  | 'setAfterSalesDrafts'
  | 'setReviewErrors'
  | 'setReviewDrafts'
>

type CustomerProfileParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customerNameDraft'
  | 'addressDraft'
  | 'runAction'
  | 'setError'
  | 'setAddressFormErrors'
  | 'setAddressDraft'
  | 'setSession'
>

type CustomerRechargeParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customRechargeAmount'
  | 'runAction'
  | 'navigate'
  | 'setCustomRechargeAmount'
  | 'setSelectedRechargeAmount'
  | 'setRechargeFieldError'
>

type CustomerSearchParams = Pick<
  CustomerActionParams,
  | 'customerStoreSearchDraft'
  | 'setCustomerStoreSearchDraft'
  | 'setCustomerStoreSearch'
  | 'setCustomerStoreSearchHistory'
>

type OrderSubmissionValidationResult =
  | { ok: true }
  | { ok: false }

type ReviewSubmissionValidationResult =
  | { ok: true; payload: ReturnType<typeof buildReviewPayload> }
  | { ok: false }

function clearDraftError(
  setter:
    | CustomerActionParams['setPartialRefundErrors']
    | CustomerActionParams['setAfterSalesErrors']
    | CustomerActionParams['setReviewErrors'],
  key: string,
) {
  setter((current) => removeKey(current, key))
}

function setDraftError(
  setter:
    | CustomerActionParams['setPartialRefundErrors']
    | CustomerActionParams['setAfterSalesErrors']
    | CustomerActionParams['setReviewErrors']
    | CustomerActionParams['setOrderChatErrors'],
  key: string,
  message: string,
) {
  setter((current) => ({ ...current, [key]: message }))
}

function createCustomerSearchActions(params: CustomerSearchParams) {
  const {
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    setCustomerStoreSearchHistory,
  } = params

  function submitCustomerStoreSearch(keyword?: string) {
    const nextKeyword = (keyword ?? customerStoreSearchDraft).trim()
    setCustomerStoreSearchDraft(nextKeyword)
    setCustomerStoreSearch(nextKeyword)
  }

  function clearCustomerStoreSearchHistory() {
    setCustomerStoreSearchHistory([])
    window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
  }

  function removeCustomerStoreSearchHistoryItem(keyword: string) {
    setCustomerStoreSearchHistory((current) => {
      const next = current.filter((entry) => entry !== keyword)
      persistCustomerStoreSearchHistory(next)
      return next
    })
  }

  return {
    submitCustomerStoreSearch,
    clearCustomerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
  }
}

function createCustomerOrderActions(params: CustomerOrderParams) {
  const {
    selectedStore,
    selectedStoreIsOpen,
    selectedCustomer,
    selectedCoupon,
    quantities,
    deliveryAddress,
    scheduledDeliveryTime,
    scheduledDeliveryTouched,
    remark,
    payableTotalCents,
    orderChatDrafts,
    runAction,
    navigate,
    setDeliveryAddressError,
    setScheduledDeliveryError,
    setScheduledDeliveryTime,
    setScheduledDeliveryTouched,
    setRemark,
    setQuantities,
    setIsCheckoutExpanded,
    setSelectedCouponId,
    setError,
    setOrderChatErrors,
    setOrderChatDrafts,
  } = params

  function openRechargePage() {
    navigate(ROUTE_PATH.customerProfileRecharge)
  }

  function validateOrderSubmission() : OrderSubmissionValidationResult {
    if (!selectedStore || !selectedCustomer) return { ok: false }
    const address = deliveryAddress.trim()
    if (!address) {
      setDeliveryAddressError(DELIVERY_CONSOLE_MESSAGES.deliveryAddressRequired)
      return { ok: false }
    }
    setDeliveryAddressError(null)

    const todayDeliveryWindow = getTodayDeliveryWindow()
    const scheduledDeliveryError = validateScheduledDeliveryTime(scheduledDeliveryTime)
    if (scheduledDeliveryTouched && scheduledDeliveryError) {
      setScheduledDeliveryError(scheduledDeliveryError)
      if (todayDeliveryWindow.isAvailable) {
        setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
      }
      return { ok: false }
    }
    setScheduledDeliveryError(null)

    if (!selectedStoreIsOpen) {
      setError(formatStoreClosedMessage(formatBusinessHours(selectedStore.businessHours)))
      return { ok: false }
    }

    const payload = buildOrderPayload(
      selectedCustomer.id,
      selectedStore,
      address,
      scheduledDeliveryTime,
      remark,
      selectedCoupon?.id ?? '',
      quantities,
    )
    if (payload.items.length === 0) {
      setError(DELIVERY_CONSOLE_MESSAGES.noMenuItemSelected)
      return { ok: false }
    }
    if (payableTotalCents > selectedCustomer.balanceCents) {
      setError(DELIVERY_CONSOLE_MESSAGES.insufficientBalanceForOrder)
      return { ok: false }
    }
    return { ok: true }
  }

  function resetOrderSubmissionState() {
    if (!selectedStore) return
    setDeliveryAddressError(null)
    setScheduledDeliveryError(null)
    setScheduledDeliveryTouched(false)
    setRemark('')
    setQuantities(getInitialQuantities(selectedStore))
    setIsCheckoutExpanded(false)
    setSelectedCouponId('')
    setError(null)
  }

  async function submitOrder() {
    if (!selectedStore || !selectedCustomer) return
    if (!validateOrderSubmission().ok) return

    const payload = buildOrderPayload(
      selectedCustomer.id,
      selectedStore,
      deliveryAddress.trim(),
      scheduledDeliveryTime,
      remark,
      selectedCoupon?.id ?? '',
      quantities,
    )
    const success = await runAction(() => createOrderRequest(payload))
    if (!success) return
    resetOrderSubmissionState()
  }

  async function submitOrderChatMessage(orderId: string) {
    const body = orderChatDrafts[orderId] ?? ''
    const payload = buildOrderChatPayload(body)
    if (!payload.body) {
      setDraftError(
        setOrderChatErrors,
        orderId,
        DELIVERY_CONSOLE_MESSAGES.orderChatMessageRequired,
      )
      return
    }
    const success = await runAction(() => sendOrderChatMessageRequest(orderId, payload))
    if (!success) return
    setOrderChatDrafts((current) => removeKey(current, orderId))
    clearDraftError(setOrderChatErrors, orderId)
  }

  return {
    openRechargePage,
    submitOrder,
    submitOrderChatMessage,
  }
}

function createCustomerSupportActions(params: CustomerSupportParams) {
  const {
    state,
    partialRefundDrafts,
    afterSalesDrafts,
    reviewDrafts,
    runAction,
    navigate,
    setPartialRefundErrors,
    setPartialRefundDrafts,
    setAfterSalesErrors,
    setAfterSalesDrafts,
    setReviewErrors,
    setReviewDrafts,
  } = params

  function getRemainingRefundableQuantity(order: OrderSummary, menuItemId: string) {
    const orderItem = order.items.find((item) => item.menuItemId === menuItemId)
    if (!orderItem) return 0

    const refundedQuantity =
      order.partialRefundRequests
        .filter((refund) => refund.menuItemId === menuItemId && refund.status === APPLICATION_STATUS.approved)
        .reduce((sum: number, refund) => sum + refund.quantity, 0)

    return Math.max(0, orderItem.quantity - refundedQuantity)
  }

  function canSubmitPartialRefund(order: OrderSummary) {
    const isRefundableOrder =
      order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing

    return (
      isRefundableOrder &&
      order.items.some((item) => getRemainingRefundableQuantity(order, item.menuItemId) > 0)
    )
  }

  function validateReviewSubmission(
    orderId: string,
    target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  ): ReviewSubmissionValidationResult {
    const draftKey = `${orderId}-${target}`
    const draft = reviewDrafts[draftKey] ?? createInitialReviewDraft()
    const payload = buildReviewPayload(target, draft)
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order || !canReviewOrder(order)) {
      setDraftError(setReviewErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.reviewOrderUnavailable)
      return { ok: false }
    }
    const submission = target === REVIEW_TARGET.store ? payload.storeReview : payload.riderReview
    if (!submission) return { ok: false }
    if (submission.rating < 5 && !submission.comment) {
      setDraftError(setReviewErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.lowRatingCommentRequired)
      return { ok: false }
    }
    return { ok: true, payload }
  }

  async function submitPartialRefundRequest(orderId: string, menuItemId: string) {
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const draftKey = `${orderId}-${menuItemId}`
    const remainingRefundableQuantity = getRemainingRefundableQuantity(order, menuItemId)
    if (remainingRefundableQuantity <= 0) {
      setDraftError(
        setPartialRefundErrors,
        draftKey,
        formatMaxPartialRefundQuantityMessage(remainingRefundableQuantity),
      )
      return
    }
    const draft = partialRefundDrafts[draftKey]
    const payload = buildPartialRefundPayload(menuItemId, draft)
    if (!payload.reason) {
      setDraftError(
        setPartialRefundErrors,
        draftKey,
        DELIVERY_CONSOLE_MESSAGES.partialRefundReasonRequired,
      )
      return
    }
    if (payload.quantity > remainingRefundableQuantity) {
      setDraftError(
        setPartialRefundErrors,
        draftKey,
        formatMaxPartialRefundQuantityMessage(remainingRefundableQuantity),
      )
      return
    }
    const success = await runAction(() => submitPartialRefundRequestCall(orderId, payload))
    if (!success) return
    setPartialRefundDrafts((current) => removeKey(current, draftKey))
    clearDraftError(setPartialRefundErrors, draftKey)
  }

  async function submitAfterSalesRequest(orderId: string) {
    const payload = buildAfterSalesPayload(afterSalesDrafts[orderId] ?? createInitialAfterSalesDraft())
    if (!payload.reason) {
      setDraftError(
        setAfterSalesErrors,
        orderId,
        DELIVERY_CONSOLE_MESSAGES.afterSalesReasonRequired,
      )
      return
    }
    if (
      payload.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest &&
      payload.expectedCompensationCents === undefined
    ) {
      setDraftError(
        setAfterSalesErrors,
        orderId,
        DELIVERY_CONSOLE_MESSAGES.expectedCompensationRequired,
      )
      return
    }
    const success = await runAction(() => submitAfterSalesRequestCall(orderId, payload))
    if (!success) return
    setAfterSalesDrafts((current) => removeKey(current, orderId))
    clearDraftError(setAfterSalesErrors, orderId)
  }

  async function submitReview(
    orderId: string,
    target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  ) {
    const draftKey = `${orderId}-${target}`
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const validation = validateReviewSubmission(orderId, target)
    if (!validation.ok) return

    const success = await runAction(() => reviewOrderRequest(orderId, validation.payload))
    if (!success) return

    setReviewDrafts((current) => removeKey(current, draftKey))
    clearDraftError(setReviewErrors, draftKey)

    const reviewCompleted =
      target === REVIEW_TARGET.store ? !hasPendingRiderReview(order) : true
    if (reviewCompleted) {
      navigate(ROUTE_PATH.customerOrders)
    }
  }

  return {
    getRemainingRefundableQuantity,
    canSubmitPartialRefund,
    submitPartialRefundRequest,
    submitAfterSalesRequest,
    submitReview,
  }
}

function createCustomerProfileActions(params: CustomerProfileParams) {
  const {
    selectedCustomer,
    customerNameDraft,
    addressDraft,
    runAction,
    setError,
    setAddressFormErrors,
    setAddressDraft,
    setSession,
  } = params

  async function saveCustomerName() {
    if (!selectedCustomer) return
    const payload = buildCustomerProfilePayload(customerNameDraft)
    if (!payload.name) {
      setError(DELIVERY_CONSOLE_MESSAGES.customerNameRequired)
      return
    }
    const success = await runAction(() => updateCustomerProfileRequest(selectedCustomer.id, payload))
    if (!success) return
    setSession((current) =>
      current
        ? {
            ...current,
            user: { ...current.user, displayName: payload.name },
          }
        : current,
    )
    setError(null)
  }

  async function addCustomerAddress() {
    if (!selectedCustomer) return
    const nextErrors = validateCustomerAddressDraft(addressDraft)
    setAddressFormErrors(nextErrors)
    if (nextErrors.label || nextErrors.address) return
    const success = await runAction(() =>
      addCustomerAddressRequest(selectedCustomer.id, buildCustomerAddressPayload(addressDraft)),
    )
    if (!success) return
    setAddressDraft({ label: '', address: '' })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() =>
      removeCustomerAddressRequest(selectedCustomer.id, { address: addressId }),
    )
  }

  async function setDefaultCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() =>
      setDefaultCustomerAddressRequest(selectedCustomer.id, { address: addressId }),
    )
  }

  return {
    saveCustomerName,
    addCustomerAddress,
    removeCustomerAddress,
    setDefaultCustomerAddress,
  }
}

function createCustomerRechargeActions(params: CustomerRechargeParams) {
  const {
    selectedCustomer,
    customRechargeAmount,
    runAction,
    navigate,
    setCustomRechargeAmount,
    setSelectedRechargeAmount,
    setRechargeFieldError,
  } = params

  function selectRechargeAmount(amount: number) {
    setSelectedRechargeAmount(amount)
    setCustomRechargeAmount('')
    setRechargeFieldError(null)
  }

  async function submitRechargeFromPage() {
    if (!selectedCustomer) return
    const amount = parseRechargeAmount(customRechargeAmount) ?? RECHARGE_PRESET_AMOUNTS[DEFAULT_RECHARGE_PRESET_INDEX]
    if (amount <= 0) {
      setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.invalidRechargeAmount)
      return
    }
    if (amount > MAX_RECHARGE_AMOUNT_YUAN) {
      setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.rechargeAmountTooLarge)
      return
    }
    const success = await runAction(() => rechargeCustomerBalanceRequest(selectedCustomer.id, buildRechargePayload(amount)))
    if (!success) return
    setRechargeFieldError(null)
    navigate(ROUTE_PATH.customerProfile)
  }

  return {
    selectRechargeAmount,
    submitRechargeFromPage,
  }
}

export function createCustomerActions(params: CustomerActionParams) {
  return {
    ...createCustomerSearchActions(params),
    ...createCustomerOrderActions(params),
    ...createCustomerSupportActions(params),
    ...createCustomerProfileActions(params),
    ...createCustomerRechargeActions(params),
  }
}
