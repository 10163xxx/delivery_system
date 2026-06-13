import { useRef } from 'react'
import { createInitialMerchantDraft, createInitialMerchantProfileDraft } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import type {
  AddressLabel,
  AddressText,
  DisplayText,
  PersonName,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { CUSTOMER_ADDRESS_FIELD, CUSTOMER_STORE_VISIBILITY } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import { MERCHANT_APPLICATION_VIEW, MERCHANT_WORKSPACE_VIEW } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import {
  useCustomerPageState,
} from '@/pages/CustomerConsole/hooks/CustomerPageState'
import {
  useMerchantPageState,
} from '@/pages/MerchantConsole/hooks/MerchantPageState'
import {
  useReviewAndTicketState,
} from '@/pages/OrderConsole/hooks/OrderReviewTicketState'
import {
  useSelectionState,
} from '@/pages/DeliveryConsole/functions/DeliveryRouteState'

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
  customerState.store.setCustomerStoreSearchDraft(asDomainText<DisplayText>(''))
  customerState.store.setCustomerStoreSearch(asDomainText<DisplayText>(''))
  customerState.store.setCustomerStoreVisibility(CUSTOMER_STORE_VISIBILITY.orderableOnly)
  customerState.checkout.setDeliveryAddress(asDomainText<AddressText>(''))
  customerState.checkout.setDeliveryAddressError(null)
  customerState.checkout.setScheduledDeliveryTime(asDomainText<DisplayText>(''))
  customerState.checkout.setScheduledDeliveryError(null)
  customerState.checkout.setScheduledDeliveryTouched(false)
  customerState.checkout.setRemark(asDomainText<DisplayText>(''))
  customerState.checkout.setIsCheckoutExpanded(false)
  customerState.checkout.setSelectedCouponId('')
  customerState.profile.setCustomerNameDraft(asDomainText<PersonName>(''))
  customerState.profile.setAddressDraft({
    [CUSTOMER_ADDRESS_FIELD.label]: asDomainText<AddressLabel>(''),
    [CUSTOMER_ADDRESS_FIELD.address]: asDomainText<AddressText>(''),
  })
  customerState.profile.setAddressFormErrors({})
  customerState.recharge.setCustomRechargeAmount(asDomainText<DisplayText>(''))
  customerState.recharge.setSelectedRechargeAmount(null)
  customerState.recharge.setRechargeFieldError(null)
  customerState.checkout.setQuantities({})
  customerState.notices.setSeenCustomerProfileNoticeIds([])
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
