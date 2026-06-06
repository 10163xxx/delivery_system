import { useRef } from 'react'
import { createInitialMerchantDraft, createInitialMerchantProfileDraft } from '@/features/delivery/DeliveryServices'
import type {
  AddressLabel,
  AddressText,
  DisplayText,
  PersonName,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'
import {
  CUSTOMER_STORE_VISIBILITY,
  CUSTOMER_ADDRESS_FIELD,
  MERCHANT_APPLICATION_VIEW,
  MERCHANT_WORKSPACE_VIEW,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import {
  useCustomerPageState,
  useMerchantPageState,
  useReviewAndTicketState,
  useSelectionState,
} from './DeliveryPageStateSlices'

function resetSelectionState(selectionState: ReturnType<typeof useSelectionState>) {
  selectionState.setSelectedCustomerId('')
  selectionState.setSelectedStoreCategory(asDomainText<DisplayText>(''))
  selectionState.setSelectedStoreId('')
  selectionState.setSelectedMerchantStoreId('')
  selectionState.setSelectedRiderId('')
  selectionState.setMerchantWorkspaceState(MERCHANT_WORKSPACE_VIEW.application)
  selectionState.setMerchantApplicationState(MERCHANT_APPLICATION_VIEW.submit)
}

function resetCustomerPageState(customerState: ReturnType<typeof useCustomerPageState>) {
  customerState.setCustomerStoreSearchDraft(asDomainText<DisplayText>(''))
  customerState.setCustomerStoreSearch(asDomainText<DisplayText>(''))
  customerState.setCustomerStoreVisibility(CUSTOMER_STORE_VISIBILITY.orderableOnly)
  customerState.setDeliveryAddress(asDomainText<AddressText>(''))
  customerState.setDeliveryAddressError(null)
  customerState.setScheduledDeliveryTime(asDomainText<DisplayText>(''))
  customerState.setScheduledDeliveryError(null)
  customerState.setScheduledDeliveryTouched(false)
  customerState.setRemark(asDomainText<DisplayText>(''))
  customerState.setIsCheckoutExpanded(false)
  customerState.setSelectedCouponId('')
  customerState.setCustomerNameDraft(asDomainText<PersonName>(''))
  customerState.setAddressDraft({
    [CUSTOMER_ADDRESS_FIELD.label]: asDomainText<AddressLabel>(''),
    [CUSTOMER_ADDRESS_FIELD.address]: asDomainText<AddressText>(''),
  })
  customerState.setAddressFormErrors({})
  customerState.setCustomRechargeAmount(asDomainText<DisplayText>(''))
  customerState.setSelectedRechargeAmount(null)
  customerState.setRechargeFieldError(null)
  customerState.setQuantities({})
  customerState.setSeenCustomerProfileNoticeIds([])
}

function resetMerchantPageState(merchantState: ReturnType<typeof useMerchantPageState>) {
  merchantState.setMerchantProfileDraft(createInitialMerchantProfileDraft())
  merchantState.setMerchantProfileFormErrors({})
  merchantState.setMerchantWithdrawAmount(asDomainText<DisplayText>(''))
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

function resetReviewAndTicketState(
  reviewAndTicketState: ReturnType<typeof useReviewAndTicketState>,
) {
  reviewAndTicketState.setOrderChatDrafts({})
  reviewAndTicketState.setOrderChatErrors({})
  reviewAndTicketState.setReviewDrafts({})
  reviewAndTicketState.setReviewErrors({})
  reviewAndTicketState.setPartialRefundDrafts({})
  reviewAndTicketState.setPartialRefundErrors({})
  reviewAndTicketState.setAfterSalesDrafts({})
  reviewAndTicketState.setAfterSalesErrors({})
  reviewAndTicketState.setPartialRefundResolutionDrafts({})
  reviewAndTicketState.setApplicationReviewDrafts({})
  reviewAndTicketState.setAfterSalesResolutionDrafts({})
  reviewAndTicketState.setResolutionDrafts({})
  reviewAndTicketState.setRiderAppealDrafts({})
  reviewAndTicketState.setAppealResolutionDrafts({})
  reviewAndTicketState.setEligibilityResolutionDrafts({})
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
  const reviewAndTicketState = useReviewAndTicketState()
  const lastCustomerDraftSyncIdRef = useRef<string | null>(null)
  const lastMerchantProfileDraftSyncIdRef = useRef<string | null>(null)

  function resetPageState() {
    resetSelectionState(selectionState)
    resetCustomerPageState(customerState)
    resetMerchantPageState(merchantState)
    resetReviewAndTicketState(reviewAndTicketState)
    resetSyncRefs({
      lastCustomerDraftSyncIdRef,
      lastMerchantProfileDraftSyncIdRef,
    })
  }

  return {
    ...selectionState,
    ...customerState,
    ...merchantState,
    ...reviewAndTicketState,
    lastCustomerDraftSyncIdRef,
    lastMerchantProfileDraftSyncIdRef,
    resetPageState,
  }
}
