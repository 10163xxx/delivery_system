import { useRef } from 'react'
import { createInitialMerchantDraft, createInitialMerchantProfileDraft } from '@/shared/delivery/DeliveryServices'
import {
  CUSTOMER_STORE_VISIBILITY,
  CUSTOMER_ADDRESS_FIELD,
  MERCHANT_APPLICATION_VIEW,
  MERCHANT_WORKSPACE_VIEW,
} from '@/shared/object/core/DeliveryAppObjects'
import {
  useCustomerPageState,
  useMerchantPageState,
  useReviewAndSupportState,
  useSelectionState,
} from './DeliveryPageStateSlices'

function resetSelectionState(selectionState: ReturnType<typeof useSelectionState>) {
  selectionState.setSelectedCustomerId('')
  selectionState.setSelectedStoreCategory('')
  selectionState.setSelectedStoreId('')
  selectionState.setSelectedMerchantStoreId('')
  selectionState.setSelectedRiderId('')
  selectionState.setMerchantWorkspaceState(MERCHANT_WORKSPACE_VIEW.application)
  selectionState.setMerchantApplicationState(MERCHANT_APPLICATION_VIEW.submit)
}

function resetCustomerPageState(customerState: ReturnType<typeof useCustomerPageState>) {
  customerState.setCustomerStoreSearchDraft('')
  customerState.setCustomerStoreSearch('')
  customerState.setCustomerStoreVisibility(CUSTOMER_STORE_VISIBILITY.orderableOnly)
  customerState.setDeliveryAddress('')
  customerState.setDeliveryAddressError(null)
  customerState.setScheduledDeliveryTime('')
  customerState.setScheduledDeliveryError(null)
  customerState.setScheduledDeliveryTouched(false)
  customerState.setRemark('')
  customerState.setIsCheckoutExpanded(false)
  customerState.setSelectedCouponId('')
  customerState.setCustomerNameDraft('')
  customerState.setAddressDraft({
    [CUSTOMER_ADDRESS_FIELD.label]: '',
    [CUSTOMER_ADDRESS_FIELD.address]: '',
  })
  customerState.setAddressFormErrors({})
  customerState.setCustomRechargeAmount('')
  customerState.setSelectedRechargeAmount(null)
  customerState.setRechargeFieldError(null)
  customerState.setQuantities({})
  customerState.setSeenCustomerProfileNoticeIds([])
}

function resetMerchantPageState(merchantState: ReturnType<typeof useMerchantPageState>) {
  merchantState.setMerchantProfileDraft(createInitialMerchantProfileDraft())
  merchantState.setMerchantProfileFormErrors({})
  merchantState.setMerchantWithdrawAmount('')
  merchantState.setMerchantWithdrawFieldError(null)
  merchantState.setMerchantDraft(createInitialMerchantDraft())
  merchantState.setMerchantFormErrors({})
  merchantState.setIsMerchantImageUploading(false)
  merchantState.setMenuItemDrafts({})
  merchantState.setMenuComposerOpen({})
  merchantState.setMenuItemFormErrors({})
  merchantState.setMenuItemImageUploading({})
  merchantState.setMerchantAppealDrafts({})
  merchantState.setEligibilityReviewDrafts({})
}

function resetReviewAndSupportState(
  reviewAndSupportState: ReturnType<typeof useReviewAndSupportState>,
) {
  reviewAndSupportState.setOrderChatDrafts({})
  reviewAndSupportState.setOrderChatErrors({})
  reviewAndSupportState.setReviewDrafts({})
  reviewAndSupportState.setReviewErrors({})
  reviewAndSupportState.setPartialRefundDrafts({})
  reviewAndSupportState.setPartialRefundErrors({})
  reviewAndSupportState.setAfterSalesDrafts({})
  reviewAndSupportState.setAfterSalesErrors({})
  reviewAndSupportState.setPartialRefundResolutionDrafts({})
  reviewAndSupportState.setApplicationReviewDrafts({})
  reviewAndSupportState.setAfterSalesResolutionDrafts({})
  reviewAndSupportState.setResolutionDrafts({})
  reviewAndSupportState.setRiderAppealDrafts({})
  reviewAndSupportState.setAppealResolutionDrafts({})
  reviewAndSupportState.setEligibilityResolutionDrafts({})
}

function resetSyncRefs(args: {
  lastCustomerDraftSyncIdRef: ReturnType<typeof useRef<string | null>>
  lastMerchantProfileDraftSyncIdRef: ReturnType<typeof useRef<string | null>>
}) {
  args.lastCustomerDraftSyncIdRef.current = null
  args.lastMerchantProfileDraftSyncIdRef.current = null
}

export function useDeliveryConsolePageState() {
  const selectionState = useSelectionState()
  const customerState = useCustomerPageState()
  const merchantState = useMerchantPageState()
  const reviewAndSupportState = useReviewAndSupportState()
  const lastCustomerDraftSyncIdRef = useRef<string | null>(null)
  const lastMerchantProfileDraftSyncIdRef = useRef<string | null>(null)

  function resetPageState() {
    resetSelectionState(selectionState)
    resetCustomerPageState(customerState)
    resetMerchantPageState(merchantState)
    resetReviewAndSupportState(reviewAndSupportState)
    resetSyncRefs({
      lastCustomerDraftSyncIdRef,
      lastMerchantProfileDraftSyncIdRef,
    })
  }

  return {
    ...selectionState,
    ...customerState,
    ...merchantState,
    ...reviewAndSupportState,
    lastCustomerDraftSyncIdRef,
    lastMerchantProfileDraftSyncIdRef,
    resetPageState,
  }
}
