import type { OrderSummary } from '@/domain'
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
} from '@/api'
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
  DEFAULT_REVIEW_RATING,
  DELIVERY_CONSOLE_MESSAGES,
  formatDeliveryTimeAdjustedMessage,
  formatMaxPartialRefundQuantityMessage,
  formatStoreClosedMessage,
  formatBusinessHours,
  formatDateTimeLocalValue,
  getInitialQuantities,
  getTodayDeliveryWindow,
  hasPendingRiderReview,
  hasPendingStoreReview,
  normalizeTextInput,
  parseRechargeAmount,
  MAX_REVIEW_COMMENT_LENGTH,
  validateCustomerAddressDraft,
  validateScheduledDeliveryTime,
} from '@/features/delivery-console'
import type { CustomerActionParams } from '@/features/delivery-console/actions/customer-actions.types'

export function createCustomerActions(params: CustomerActionParams) {
  const {
    state,
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
    partialRefundDrafts,
    afterSalesDrafts,
    reviewDrafts,
    orderChatDrafts,
    customerNameDraft,
    addressDraft,
    customRechargeAmount,
    runAction,
    navigate,
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    setCustomerStoreSearchHistory,
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
    setPartialRefundErrors,
    setPartialRefundDrafts,
    setAfterSalesErrors,
    setAfterSalesDrafts,
    setReviewErrors,
    setReviewDrafts,
    setAddressFormErrors,
    setAddressDraft,
    setSession,
    setCustomRechargeAmount,
    setSelectedRechargeAmount,
    setRechargeFieldError,
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
      if (next.length === 0) {
        window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
      } else {
        window.localStorage.setItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  async function submitOrder() {
    if (!selectedStore || !selectedCustomer) return
    if (!selectedStoreIsOpen) {
      setError(formatStoreClosedMessage(formatBusinessHours(selectedStore.businessHours)))
      return
    }

    const latestDeliveryWindow = getTodayDeliveryWindow()
    let nextScheduledDeliveryTime = scheduledDeliveryTime || latestDeliveryWindow.minimumValue
    const scheduleError = validateScheduledDeliveryTime(nextScheduledDeliveryTime)
    if (scheduleError) {
      if (scheduleError === DELIVERY_CONSOLE_MESSAGES.deliveryTimeTooEarly && latestDeliveryWindow.isAvailable) {
        nextScheduledDeliveryTime = latestDeliveryWindow.minimumValue
        setScheduledDeliveryTime(nextScheduledDeliveryTime)
        if (scheduledDeliveryTouched) {
          setScheduledDeliveryError(formatDeliveryTimeAdjustedMessage(formatDateTimeLocalValue(nextScheduledDeliveryTime)))
          return
        }
      } else {
        setScheduledDeliveryError(scheduleError)
        return
      }
    }
    setScheduledDeliveryError(null)

    const payload = buildOrderPayload(
      selectedCustomer.id,
      selectedStore,
      deliveryAddress,
      nextScheduledDeliveryTime,
      remark,
      selectedCoupon?.id ?? '',
      quantities,
    )

    if (payload.items.length === 0) return setError(DELIVERY_CONSOLE_MESSAGES.noMenuItemSelected)
    if (!payload.deliveryAddress) return setDeliveryAddressError(DELIVERY_CONSOLE_MESSAGES.deliveryAddressRequired)
    setDeliveryAddressError(null)
    if (!payload.scheduledDeliveryAt) return setScheduledDeliveryError(DELIVERY_CONSOLE_MESSAGES.deliveryTimeSelectionRequired)
    if (selectedCustomer.balanceCents < payableTotalCents) return setError(DELIVERY_CONSOLE_MESSAGES.insufficientBalanceForOrder)

    const success = await runAction(() => createOrderRequest(payload))
    if (!success) return

    setRemark('')
    setScheduledDeliveryTime(latestDeliveryWindow.minimumValue)
    setScheduledDeliveryTouched(false)
    setQuantities(getInitialQuantities(selectedStore))
    setIsCheckoutExpanded(false)
    setSelectedCouponId('')
  }

  async function submitOrderChatMessage(orderId: string) {
    const payload = buildOrderChatPayload(orderChatDrafts[orderId] ?? '')
    if (!payload.body) {
      setOrderChatErrors((current) => ({ ...current, [orderId]: DELIVERY_CONSOLE_MESSAGES.orderChatMessageRequired }))
      return
    }
    setOrderChatErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })

    const success = await runAction(() => sendOrderChatMessageRequest(orderId, payload))
    if (!success) return
    setOrderChatDrafts((current) => ({ ...current, [orderId]: '' }))
  }

  function getRemainingRefundableQuantity(order: OrderSummary, menuItemId: string) {
    const item = order.items.find((entry) => entry.menuItemId === menuItemId)
    if (!item) return 0
    const pendingQuantity = order.partialRefundRequests
      .filter((refund) => refund.menuItemId === menuItemId && refund.status === 'Pending')
      .reduce((sum, refund) => sum + refund.quantity, 0)
    return Math.max(0, item.quantity - item.refundedQuantity - pendingQuantity)
  }

  function canSubmitPartialRefund(order: OrderSummary) {
    return order.status === 'PendingMerchantAcceptance' || order.status === 'Preparing'
  }

  async function submitPartialRefundRequest(orderId: string, menuItemId: string) {
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order || !canSubmitPartialRefund(order)) return setError(DELIVERY_CONSOLE_MESSAGES.partialRefundUnavailable)
    const draftKey = `${orderId}-${menuItemId}`
    const payload = buildPartialRefundPayload(menuItemId, partialRefundDrafts[draftKey])
    const remainingQuantity = getRemainingRefundableQuantity(order, menuItemId)
    if (!payload.reason) return setPartialRefundErrors((current) => ({ ...current, [draftKey]: DELIVERY_CONSOLE_MESSAGES.partialRefundReasonRequired }))
    if (payload.quantity > remainingQuantity) {
      return setPartialRefundErrors((current) => ({ ...current, [draftKey]: formatMaxPartialRefundQuantityMessage(remainingQuantity) }))
    }

    const success = await runAction(() => submitPartialRefundRequestCall(orderId, payload))
    if (!success) return
    setPartialRefundDrafts((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
    setPartialRefundErrors((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
  }

  async function submitAfterSalesRequest(orderId: string) {
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order) return setError(DELIVERY_CONSOLE_MESSAGES.orderNotFound)
    const draft = afterSalesDrafts[orderId] ?? createInitialAfterSalesDraft()
    const payload = buildAfterSalesPayload(draft)
    if (!payload.reason) return setAfterSalesErrors((current) => ({ ...current, [orderId]: DELIVERY_CONSOLE_MESSAGES.afterSalesReasonRequired }))
    if (payload.requestType === 'CompensationRequest' && (!payload.expectedCompensationCents || payload.expectedCompensationCents <= 0)) {
      return setAfterSalesErrors((current) => ({ ...current, [orderId]: DELIVERY_CONSOLE_MESSAGES.expectedCompensationRequired }))
    }
    setAfterSalesErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })
    const success = await runAction(() => submitAfterSalesRequestCall(orderId, payload))
    if (!success) return
    setAfterSalesDrafts((current) => ({ ...current, [orderId]: createInitialAfterSalesDraft() }))
  }

  async function submitReview(orderId: string, target: 'store' | 'rider') {
    const order = state?.orders.find((entry) => entry.id === orderId)
    const draftKey = `${orderId}-${target}`
    const draft = reviewDrafts[draftKey] ?? createInitialReviewDraft()
    if (!order || !canReviewOrder(order)) {
      setError(DELIVERY_CONSOLE_MESSAGES.reviewOrderUnavailable)
      navigate('/customer/orders')
      return
    }
    if (target === 'store' && !hasPendingStoreReview(order)) return setError(DELIVERY_CONSOLE_MESSAGES.storeReviewAlreadySubmitted)
    if (target === 'rider' && !hasPendingRiderReview(order)) return setError(DELIVERY_CONSOLE_MESSAGES.riderReviewUnavailable)
    if (draft.rating < DEFAULT_REVIEW_RATING && !normalizeTextInput(draft.comment, MAX_REVIEW_COMMENT_LENGTH)) {
      return setReviewErrors((current) => ({ ...current, [draftKey]: DELIVERY_CONSOLE_MESSAGES.lowRatingCommentRequired }))
    }
    const success = await runAction(() => reviewOrderRequest(orderId, buildReviewPayload(target, draft)))
    if (!success) return
    setReviewDrafts((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
    setReviewErrors((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
  }

  async function saveCustomerName() {
    if (!selectedCustomer) return
    const payload = buildCustomerProfilePayload(customerNameDraft)
    if (!payload.name) return setError(DELIVERY_CONSOLE_MESSAGES.customerNameRequired)
    const success = await runAction(() => updateCustomerProfileRequest(selectedCustomer.id, payload))
    if (!success) return
    setSession((current: any) => current ? { ...current, user: { ...current.user, displayName: payload.name } } : current)
  }

  async function addCustomerAddress() {
    if (!selectedCustomer) return
    const payload = buildCustomerAddressPayload(addressDraft)
    const nextErrors = validateCustomerAddressDraft(addressDraft)
    setAddressFormErrors(nextErrors)
    if (nextErrors.label || nextErrors.address) return
    await runAction(() => addCustomerAddressRequest(selectedCustomer.id, payload))
    setAddressDraft({ label: '', address: '' })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(address: string) {
    if (!selectedCustomer || !address.trim()) return
    await runAction(() => removeCustomerAddressRequest(selectedCustomer.id, { address }))
  }

  async function setDefaultCustomerAddress(address: string) {
    if (!selectedCustomer || !address.trim() || selectedCustomer.defaultAddress === address) return
    const success = await runAction(() => setDefaultCustomerAddressRequest(selectedCustomer.id, { address }))
    if (!success) return
  }

  async function rechargeCustomerBalance(amountYuan: number) {
    if (!selectedCustomer) return
    if (!Number.isFinite(amountYuan) || amountYuan <= 0) return setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.invalidRechargeAmount)
    if (amountYuan > MAX_RECHARGE_AMOUNT_YUAN) {
      return setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.singleRechargeAmountTooLarge)
    }
    setRechargeFieldError(null)
    await runAction(() => rechargeCustomerBalanceRequest(selectedCustomer.id, buildRechargePayload(amountYuan)))
    setCustomRechargeAmount('')
    setSelectedRechargeAmount(null)
    navigate('/customer/profile')
  }

  function openRechargePage() {
    setCustomRechargeAmount(String(RECHARGE_PRESET_AMOUNTS[DEFAULT_RECHARGE_PRESET_INDEX]))
    setSelectedRechargeAmount(RECHARGE_PRESET_AMOUNTS[DEFAULT_RECHARGE_PRESET_INDEX])
    setRechargeFieldError(null)
    navigate('/customer/profile/recharge')
  }

  function selectRechargeAmount(amount: number) {
    setSelectedRechargeAmount(amount)
    setCustomRechargeAmount(String(amount))
    setRechargeFieldError(null)
  }

  async function submitRechargeFromPage() {
    const amount = parseRechargeAmount(customRechargeAmount)
    if (amount === null) return setRechargeFieldError(DELIVERY_CONSOLE_MESSAGES.invalidRechargeAmount)
    setSelectedRechargeAmount(amount)
    await rechargeCustomerBalance(amount)
  }

  return {
    submitCustomerStoreSearch,
    clearCustomerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    submitOrder,
    submitOrderChatMessage,
    getRemainingRefundableQuantity,
    canSubmitPartialRefund,
    submitPartialRefundRequest,
    submitAfterSalesRequest,
    submitReview,
    saveCustomerName,
    addCustomerAddress,
    removeCustomerAddress,
    setDefaultCustomerAddress,
    rechargeCustomerBalance,
    openRechargePage,
    selectRechargeAmount,
    submitRechargeFromPage,
  }
}
