import { useRef, useState } from 'react'
import type { ResolveTicketRequest } from '@/shared/object/SharedObjects'
import { createInitialMerchantDraft, createInitialMerchantProfileDraft } from '@/shared/delivery/DeliveryServices'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  AppealResolutionDraft,
  CustomerAddressDraft,
  CustomerAddressField,
  MenuItemDraft,
  MenuItemFormField,
  MerchantApplicationView,
  MerchantDraft,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
  MerchantWorkspaceView,
  PartialRefundDraft,
  ReviewDraft,
} from '@/shared/delivery-app/DeliveryAppObjects'

function useSelectionState() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [selectedMerchantStoreId, setSelectedMerchantStoreId] = useState('')
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [merchantWorkspaceState, setMerchantWorkspaceState] =
    useState<MerchantWorkspaceView>('application')
  const [merchantApplicationState, setMerchantApplicationState] =
    useState<MerchantApplicationView>('submit')

  return {
    selectedCustomerId,
    setSelectedCustomerId,
    selectedStoreCategory,
    setSelectedStoreCategory,
    selectedStoreId,
    setSelectedStoreId,
    selectedMerchantStoreId,
    setSelectedMerchantStoreId,
    selectedRiderId,
    setSelectedRiderId,
    merchantWorkspaceState,
    setMerchantWorkspaceState,
    merchantApplicationState,
    setMerchantApplicationState,
  }
}

function useCustomerPageState() {
  const [customerStoreSearchDraft, setCustomerStoreSearchDraft] = useState('')
  const [customerStoreSearch, setCustomerStoreSearch] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryAddressError, setDeliveryAddressError] = useState<string | null>(null)
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState('')
  const [scheduledDeliveryError, setScheduledDeliveryError] = useState<string | null>(null)
  const [scheduledDeliveryTouched, setScheduledDeliveryTouched] = useState(false)
  const [remark, setRemark] = useState('')
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState('')
  const [customerNameDraft, setCustomerNameDraft] = useState('')
  const [addressDraft, setAddressDraft] = useState<CustomerAddressDraft>({
    label: '',
    address: '',
  })
  const [addressFormErrors, setAddressFormErrors] = useState<
    Partial<Record<CustomerAddressField, string>>
  >({})
  const [customRechargeAmount, setCustomRechargeAmount] = useState('')
  const [selectedRechargeAmount, setSelectedRechargeAmount] = useState<number | null>(null)
  const [rechargeFieldError, setRechargeFieldError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  return {
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    customerStoreSearch,
    setCustomerStoreSearch,
    deliveryAddress,
    setDeliveryAddress,
    deliveryAddressError,
    setDeliveryAddressError,
    scheduledDeliveryTime,
    setScheduledDeliveryTime,
    scheduledDeliveryError,
    setScheduledDeliveryError,
    scheduledDeliveryTouched,
    setScheduledDeliveryTouched,
    remark,
    setRemark,
    isCheckoutExpanded,
    setIsCheckoutExpanded,
    selectedCouponId,
    setSelectedCouponId,
    customerNameDraft,
    setCustomerNameDraft,
    addressDraft,
    setAddressDraft,
    addressFormErrors,
    setAddressFormErrors,
    customRechargeAmount,
    setCustomRechargeAmount,
    selectedRechargeAmount,
    setSelectedRechargeAmount,
    rechargeFieldError,
    setRechargeFieldError,
    quantities,
    setQuantities,
  }
}

function useMerchantPageState() {
  const [merchantProfileDraft, setMerchantProfileDraft] = useState<MerchantProfileDraft>(
    createInitialMerchantProfileDraft(),
  )
  const [merchantProfileFormErrors, setMerchantProfileFormErrors] = useState<
    Partial<Record<MerchantProfileFormField, string>>
  >({})
  const [merchantWithdrawAmount, setMerchantWithdrawAmount] = useState('')
  const [merchantWithdrawFieldError, setMerchantWithdrawFieldError] = useState<string | null>(null)
  const [merchantDraft, setMerchantDraft] = useState<MerchantDraft>(createInitialMerchantDraft())
  const [merchantFormErrors, setMerchantFormErrors] = useState<
    Partial<Record<MerchantFormField, string>>
  >({})
  const [isMerchantImageUploading, setIsMerchantImageUploading] = useState(false)
  const [menuItemDrafts, setMenuItemDrafts] = useState<Record<string, MenuItemDraft>>({})
  const [menuComposerOpen, setMenuComposerOpen] = useState<Record<string, boolean>>({})
  const [menuItemFormErrors, setMenuItemFormErrors] = useState<
    Record<string, Partial<Record<MenuItemFormField, string>>>
  >({})
  const [menuItemImageUploading, setMenuItemImageUploading] = useState<Record<string, boolean>>(
    {},
  )
  const [merchantAppealDrafts, setMerchantAppealDrafts] = useState<Record<string, string>>({})
  const [eligibilityReviewDrafts, setEligibilityReviewDrafts] = useState<Record<string, string>>(
    {},
  )

  return {
    merchantProfileDraft,
    setMerchantProfileDraft,
    merchantProfileFormErrors,
    setMerchantProfileFormErrors,
    merchantWithdrawAmount,
    setMerchantWithdrawAmount,
    merchantWithdrawFieldError,
    setMerchantWithdrawFieldError,
    merchantDraft,
    setMerchantDraft,
    merchantFormErrors,
    setMerchantFormErrors,
    isMerchantImageUploading,
    setIsMerchantImageUploading,
    menuItemDrafts,
    setMenuItemDrafts,
    menuComposerOpen,
    setMenuComposerOpen,
    menuItemFormErrors,
    setMenuItemFormErrors,
    menuItemImageUploading,
    setMenuItemImageUploading,
    merchantAppealDrafts,
    setMerchantAppealDrafts,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
  }
}

function useReviewAndSupportState() {
  const [orderChatDrafts, setOrderChatDrafts] = useState<Record<string, string>>({})
  const [orderChatErrors, setOrderChatErrors] = useState<Record<string, string>>({})
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, ReviewDraft>>({})
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})
  const [partialRefundDrafts, setPartialRefundDrafts] = useState<
    Record<string, PartialRefundDraft>
  >({})
  const [partialRefundErrors, setPartialRefundErrors] = useState<Record<string, string>>({})
  const [afterSalesDrafts, setAfterSalesDrafts] = useState<Record<string, AfterSalesDraft>>({})
  const [afterSalesErrors, setAfterSalesErrors] = useState<Record<string, string>>({})
  const [partialRefundResolutionDrafts, setPartialRefundResolutionDrafts] = useState<
    Record<string, string>
  >({})
  const [applicationReviewDrafts, setApplicationReviewDrafts] = useState<Record<string, string>>(
    {},
  )
  const [afterSalesResolutionDrafts, setAfterSalesResolutionDrafts] = useState<
    Record<string, AfterSalesResolutionDraft>
  >({})
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, ResolveTicketRequest>>(
    {},
  )
  const [riderAppealDrafts, setRiderAppealDrafts] = useState<Record<string, string>>({})
  const [appealResolutionDrafts, setAppealResolutionDrafts] = useState<
    Record<string, AppealResolutionDraft>
  >({})
  const [eligibilityResolutionDrafts, setEligibilityResolutionDrafts] = useState<
    Record<string, AppealResolutionDraft>
  >({})

  return {
    orderChatDrafts,
    setOrderChatDrafts,
    orderChatErrors,
    setOrderChatErrors,
    reviewDrafts,
    setReviewDrafts,
    reviewErrors,
    setReviewErrors,
    partialRefundDrafts,
    setPartialRefundDrafts,
    partialRefundErrors,
    setPartialRefundErrors,
    afterSalesDrafts,
    setAfterSalesDrafts,
    afterSalesErrors,
    setAfterSalesErrors,
    partialRefundResolutionDrafts,
    setPartialRefundResolutionDrafts,
    applicationReviewDrafts,
    setApplicationReviewDrafts,
    afterSalesResolutionDrafts,
    setAfterSalesResolutionDrafts,
    resolutionDrafts,
    setResolutionDrafts,
    riderAppealDrafts,
    setRiderAppealDrafts,
    appealResolutionDrafts,
    setAppealResolutionDrafts,
    eligibilityResolutionDrafts,
    setEligibilityResolutionDrafts,
  }
}

export function useDeliveryConsolePageState() {
  const selectionState = useSelectionState()
  const customerState = useCustomerPageState()
  const merchantState = useMerchantPageState()
  const reviewAndSupportState = useReviewAndSupportState()
  const lastCustomerDraftSyncIdRef = useRef<string | null>(null)
  const lastMerchantProfileDraftSyncIdRef = useRef<string | null>(null)

  function resetPageState() {
    selectionState.setSelectedCustomerId('')
    selectionState.setSelectedStoreCategory('')
    selectionState.setSelectedStoreId('')
    selectionState.setSelectedMerchantStoreId('')
    selectionState.setSelectedRiderId('')
    selectionState.setMerchantWorkspaceState('application')
    selectionState.setMerchantApplicationState('submit')

    customerState.setCustomerStoreSearchDraft('')
    customerState.setCustomerStoreSearch('')
    customerState.setDeliveryAddress('')
    customerState.setDeliveryAddressError(null)
    customerState.setScheduledDeliveryTime('')
    customerState.setScheduledDeliveryError(null)
    customerState.setScheduledDeliveryTouched(false)
    customerState.setRemark('')
    customerState.setIsCheckoutExpanded(false)
    customerState.setSelectedCouponId('')
    customerState.setCustomerNameDraft('')
    customerState.setAddressDraft({ label: '', address: '' })
    customerState.setAddressFormErrors({})
    customerState.setCustomRechargeAmount('')
    customerState.setSelectedRechargeAmount(null)
    customerState.setRechargeFieldError(null)
    customerState.setQuantities({})

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

    lastCustomerDraftSyncIdRef.current = null
    lastMerchantProfileDraftSyncIdRef.current = null
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
