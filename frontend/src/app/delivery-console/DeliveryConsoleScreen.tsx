import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AuthScreen from '@/components/AuthScreen'
import { buildAdminProps, buildCustomerProps, buildMerchantProps, buildRiderProps } from '@/app/delivery-console/build-role-props'
import { createCustomerActions } from '@/features/delivery-console/actions/customer-actions'
import { createMerchantActions } from '@/features/delivery-console/actions/merchant-actions'
import { DeliveryConsoleStage } from '@/features/delivery-console/DeliveryConsoleStage'
import { useDeliveryConsolePageState } from '@/services/shared/page-state-service'
import { useDeliveryConsolePageViewService } from '@/services/shared/page-view-service'
import { useDeliveryConsoleSessionService } from '@/services/shared/session-service'

export function DeliveryConsoleScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId: routeOrderId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionService = useDeliveryConsoleSessionService()
  const pageState = useDeliveryConsolePageState()
  const pageView = useDeliveryConsolePageViewService({
    locationPathname: location.pathname,
    navigate,
    routeOrderId,
    searchParams,
    setSearchParams,
    sessionService: {
      session: sessionService.session,
      state: sessionService.state,
      setError: sessionService.setError,
      customerStoreSearchHistory: sessionService.customerStoreSearchHistory,
      setCustomerStoreSearchHistory: sessionService.setCustomerStoreSearchHistory,
    },
    pageState,
  })

  if (!sessionService.session) {
    return <AuthScreen onAuthenticated={sessionService.setSession} />
  }

  const customerActions = createCustomerActions({
    state: sessionService.state,
    selectedStore: pageView.selectedStore,
    selectedStoreIsOpen: pageView.selectedStoreIsOpen,
    selectedCustomer: pageView.selectedCustomer,
    selectedCoupon: pageView.selectedCoupon,
    quantities: pageState.quantities,
    deliveryAddress: pageState.deliveryAddress,
    scheduledDeliveryTime: pageState.scheduledDeliveryTime,
    scheduledDeliveryTouched: pageState.scheduledDeliveryTouched,
    remark: pageState.remark,
    payableTotalCents: pageView.payableTotalCents,
    partialRefundDrafts: pageState.partialRefundDrafts,
    afterSalesDrafts: pageState.afterSalesDrafts,
    reviewDrafts: pageState.reviewDrafts,
    orderChatDrafts: pageState.orderChatDrafts,
    customerNameDraft: pageState.customerNameDraft,
    addressDraft: pageState.addressDraft,
    customRechargeAmount: pageState.customRechargeAmount,
    runAction: sessionService.runAction,
    navigate,
    customerStoreSearchDraft: pageState.customerStoreSearchDraft,
    setCustomerStoreSearchDraft: pageState.setCustomerStoreSearchDraft,
    setCustomerStoreSearch: pageState.setCustomerStoreSearch,
    setCustomerStoreSearchHistory: sessionService.setCustomerStoreSearchHistory,
    setDeliveryAddressError: pageState.setDeliveryAddressError,
    setScheduledDeliveryError: pageState.setScheduledDeliveryError,
    setScheduledDeliveryTime: pageState.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.setScheduledDeliveryTouched,
    setRemark: pageState.setRemark,
    setQuantities: pageState.setQuantities,
    setIsCheckoutExpanded: pageState.setIsCheckoutExpanded,
    setSelectedCouponId: pageState.setSelectedCouponId,
    setError: sessionService.setError,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setPartialRefundErrors: pageState.setPartialRefundErrors,
    setPartialRefundDrafts: pageState.setPartialRefundDrafts,
    setAfterSalesErrors: pageState.setAfterSalesErrors,
    setAfterSalesDrafts: pageState.setAfterSalesDrafts,
    setReviewErrors: pageState.setReviewErrors,
    setReviewDrafts: pageState.setReviewDrafts,
    setAddressFormErrors: pageState.setAddressFormErrors,
    setAddressDraft: pageState.setAddressDraft,
    setSession: sessionService.setSession,
    setCustomRechargeAmount: pageState.setCustomRechargeAmount,
    setSelectedRechargeAmount: pageState.setSelectedRechargeAmount,
    setRechargeFieldError: pageState.setRechargeFieldError,
  })

  const merchantActions = createMerchantActions({
    merchantDraft: pageState.merchantDraft,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    currentDisplayName: pageView.currentDisplayName,
    runAction: sessionService.runAction,
    merchantProfileDraft: pageState.merchantProfileDraft,
    merchantProfile: pageView.merchantProfile,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    menuItemDrafts: pageState.menuItemDrafts,
    menuItemImageUploading: pageState.menuItemImageUploading,
    setMerchantDraft: pageState.setMerchantDraft,
    setMerchantFormErrors: pageState.setMerchantFormErrors,
    setError: sessionService.setError,
    setMenuItemFormErrors: pageState.setMenuItemFormErrors,
    setMenuItemDrafts: pageState.setMenuItemDrafts,
    setMenuComposerOpen: pageState.setMenuComposerOpen,
    setIsMerchantImageUploading: pageState.setIsMerchantImageUploading,
    setMenuItemImageUploading: pageState.setMenuItemImageUploading,
    setMerchantProfileFormErrors: pageState.setMerchantProfileFormErrors,
    setMerchantWithdrawFieldError: pageState.setMerchantWithdrawFieldError,
    setMerchantWithdrawAmount: pageState.setMerchantWithdrawAmount,
    setPartialRefundResolutionDrafts: pageState.setPartialRefundResolutionDrafts,
  })

  return (
    <DeliveryConsoleStage
      role={pageView.role}
      state={sessionService.state}
      error={sessionService.error}
      busy={sessionService.busy}
      currentDisplayName={pageView.currentDisplayName}
      isRefreshing={sessionService.headerAction === 'refresh'}
      isLoggingOut={sessionService.headerAction === 'logout'}
      loadState={sessionService.loadState}
      logout={sessionService.logout}
      roleLabels={pageView.roleLabels}
      showLogoutModal={sessionService.showLogoutModal}
      customerProps={buildCustomerProps({ pageView, pageState, sessionService, customerService: customerActions, navigate })}
      merchantProps={buildMerchantProps({ pageView, pageState, sessionService, customerService: customerActions, merchantService: merchantActions, navigate })}
      riderProps={buildRiderProps({ pageView, pageState, sessionService, customerService: customerActions })}
      adminProps={buildAdminProps({ pageView, pageState, sessionService })}
    />
  )
}
