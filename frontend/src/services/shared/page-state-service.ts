import { useRef, useState } from 'react'
import type { ResolveTicketRequest } from '@/domain'
import {
  createInitialMerchantDraft,
  createInitialMerchantProfileDraft,
  type AfterSalesDraft,
  type AfterSalesResolutionDraft,
  type AppealResolutionDraft,
  type CustomerAddressDraft,
  type CustomerAddressField,
  type MenuItemDraft,
  type MenuItemFormField,
  type MerchantApplicationView,
  type MerchantDraft,
  type MerchantFormField,
  type MerchantProfileDraft,
  type MerchantProfileFormField,
  type MerchantWorkspaceView,
  type PartialRefundDraft,
  type ReviewDraft,
} from '@/features/delivery-console'

export function useDeliveryConsolePageState() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [selectedMerchantStoreId, setSelectedMerchantStoreId] = useState('')
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [merchantWorkspaceState, setMerchantWorkspaceState] =
    useState<MerchantWorkspaceView>('application')
  const [merchantApplicationState, setMerchantApplicationState] =
    useState<MerchantApplicationView>('submit')
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
  const [merchantProfileDraft, setMerchantProfileDraft] = useState<MerchantProfileDraft>(
    createInitialMerchantProfileDraft(),
  )
  const [merchantProfileFormErrors, setMerchantProfileFormErrors] = useState<
    Partial<Record<MerchantProfileFormField, string>>
  >({})
  const [merchantWithdrawAmount, setMerchantWithdrawAmount] = useState('')
  const [merchantWithdrawFieldError, setMerchantWithdrawFieldError] = useState<string | null>(null)
  const [rechargeFieldError, setRechargeFieldError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
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
  const [merchantDraft, setMerchantDraft] = useState<MerchantDraft>(createInitialMerchantDraft())
  const [merchantFormErrors, setMerchantFormErrors] = useState<
    Partial<Record<MerchantFormField, string>>
  >({})
  const [isMerchantImageUploading, setIsMerchantImageUploading] = useState(false)
  const [menuItemDrafts, setMenuItemDrafts] = useState<Record<string, MenuItemDraft>>({})
  const [, setMenuComposerOpen] = useState<Record<string, boolean>>({})
  const [menuItemFormErrors, setMenuItemFormErrors] = useState<
    Record<string, Partial<Record<MenuItemFormField, string>>>
  >({})
  const [menuItemImageUploading, setMenuItemImageUploading] = useState<Record<string, boolean>>(
    {},
  )
  const [applicationReviewDrafts, setApplicationReviewDrafts] = useState<Record<string, string>>(
    {},
  )
  const [afterSalesResolutionDrafts, setAfterSalesResolutionDrafts] = useState<
    Record<string, AfterSalesResolutionDraft>
  >({})
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, ResolveTicketRequest>>(
    {},
  )
  const [merchantAppealDrafts, setMerchantAppealDrafts] = useState<Record<string, string>>({})
  const [riderAppealDrafts, setRiderAppealDrafts] = useState<Record<string, string>>({})
  const [appealResolutionDrafts, setAppealResolutionDrafts] = useState<
    Record<string, AppealResolutionDraft>
  >({})
  const [eligibilityReviewDrafts, setEligibilityReviewDrafts] = useState<Record<string, string>>(
    {},
  )
  const [eligibilityResolutionDrafts, setEligibilityResolutionDrafts] = useState<
    Record<string, AppealResolutionDraft>
  >({})
  const lastCustomerDraftSyncIdRef = useRef<string | null>(null)
  const lastMerchantProfileDraftSyncIdRef = useRef<string | null>(null)

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
    merchantProfileDraft,
    setMerchantProfileDraft,
    merchantProfileFormErrors,
    setMerchantProfileFormErrors,
    merchantWithdrawAmount,
    setMerchantWithdrawAmount,
    merchantWithdrawFieldError,
    setMerchantWithdrawFieldError,
    rechargeFieldError,
    setRechargeFieldError,
    quantities,
    setQuantities,
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
    merchantDraft,
    setMerchantDraft,
    merchantFormErrors,
    setMerchantFormErrors,
    isMerchantImageUploading,
    setIsMerchantImageUploading,
    menuItemDrafts,
    setMenuItemDrafts,
    setMenuComposerOpen,
    menuItemFormErrors,
    setMenuItemFormErrors,
    menuItemImageUploading,
    setMenuItemImageUploading,
    applicationReviewDrafts,
    setApplicationReviewDrafts,
    afterSalesResolutionDrafts,
    setAfterSalesResolutionDrafts,
    resolutionDrafts,
    setResolutionDrafts,
    merchantAppealDrafts,
    setMerchantAppealDrafts,
    riderAppealDrafts,
    setRiderAppealDrafts,
    appealResolutionDrafts,
    setAppealResolutionDrafts,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
    eligibilityResolutionDrafts,
    setEligibilityResolutionDrafts,
    lastCustomerDraftSyncIdRef,
    lastMerchantProfileDraftSyncIdRef,
  }
}
