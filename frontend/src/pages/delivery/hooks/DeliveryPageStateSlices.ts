import { useState } from 'react'
import type {
  AddressLabel,
  AddressText,
  EligibilityReviewId,
  CouponId,
  CustomerId,
  DisplayText,
  IsoDateTime,
  MerchantApplicationId,
  MenuItemId,
  OrderId,
  PersonName,
  RefundRequestId,
  ResolveTicketRequest,
  ReviewAppealId,
  RiderId,
  StoreId,
  TicketId,
} from '@/objects/core/SharedObjects'
import { createInitialMerchantDraft, createInitialMerchantProfileDraft } from '@/features/delivery/DeliveryServices'
import { asDomainText } from '@/features/delivery/DeliveryShared'
import {
  CUSTOMER_STORE_VISIBILITY,
  type CustomerStoreVisibility,
  type AfterSalesDraft,
  type AfterSalesResolutionDraft,
  type AppealResolutionDraft,
  type CustomerAddressDraft,
  type CustomerAddressField,
  type MenuItemConfigurationModalState,
  type MenuItemDraft,
  type MenuItemFormField,
  MERCHANT_APPLICATION_VIEW as MERCHANT_APPLICATION_VIEWS,
  type MerchantApplicationView,
  type MerchantDraft,
  type MerchantFormField,
  type MerchantProfileDraft,
  type MerchantProfileFormField,
  MERCHANT_WORKSPACE_VIEW as MERCHANT_WORKSPACE_VIEWS,
  type MerchantWorkspaceView,
  type PartialRefundDraftKey,
  type PartialRefundDraft,
  type ReviewDraftKey,
  type ReviewDraft,
  type SelectedMenuItemConfiguration,
} from '@/pages/delivery/objects/DeliveryAppObjects'

export function useSelectionState() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<CustomerId | ''>('')
  const [selectedStoreCategory, setSelectedStoreCategory] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [selectedStoreId, setSelectedStoreId] = useState<StoreId | ''>('')
  const [selectedMerchantStoreId, setSelectedMerchantStoreId] = useState<StoreId | ''>('')
  const [selectedRiderId, setSelectedRiderId] = useState<RiderId | ''>('')
  const [merchantWorkspaceState, setMerchantWorkspaceState] =
    useState<MerchantWorkspaceView>(MERCHANT_WORKSPACE_VIEWS.application)
  const [merchantApplicationState, setMerchantApplicationState] =
    useState<MerchantApplicationView>(MERCHANT_APPLICATION_VIEWS.submit)

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

export function useCustomerPageState() {
  const [customerStoreSearchDraft, setCustomerStoreSearchDraft] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [customerStoreSearch, setCustomerStoreSearch] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [customerStoreVisibility, setCustomerStoreVisibility] =
    useState<CustomerStoreVisibility>(CUSTOMER_STORE_VISIBILITY.orderableOnly)
  const [deliveryAddress, setDeliveryAddress] = useState<AddressText>(asDomainText<AddressText>(''))
  const [deliveryAddressError, setDeliveryAddressError] = useState<DisplayText | null>(null)
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState<IsoDateTime | DisplayText>(asDomainText<DisplayText>(''))
  const [scheduledDeliveryError, setScheduledDeliveryError] = useState<DisplayText | null>(null)
  const [scheduledDeliveryTouched, setScheduledDeliveryTouched] = useState(false)
  const [remark, setRemark] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState<CouponId | ''>('')
  const [customerNameDraft, setCustomerNameDraft] = useState<PersonName>(asDomainText<PersonName>(''))
  const [addressDraft, setAddressDraft] = useState<CustomerAddressDraft>({
    label: asDomainText<AddressLabel>(''),
    address: asDomainText<AddressText>(''),
  })
  const [addressFormErrors, setAddressFormErrors] = useState<
    Partial<Record<CustomerAddressField, DisplayText>>
  >({})
  const [customRechargeAmount, setCustomRechargeAmount] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [selectedRechargeAmount, setSelectedRechargeAmount] = useState<number | null>(null)
  const [rechargeFieldError, setRechargeFieldError] = useState<DisplayText | null>(null)
  const [quantities, setQuantities] = useState<Record<MenuItemId, number>>({})
  const [selectedMenuItemConfigurations, setSelectedMenuItemConfigurations] = useState<
    Record<MenuItemId, SelectedMenuItemConfiguration>
  >({})
  const [menuItemConfigurationModal, setMenuItemConfigurationModal] =
    useState<MenuItemConfigurationModalState | null>(null)
  const [seenCustomerProfileNoticeIds, setSeenCustomerProfileNoticeIds] = useState<string[]>([])

  return {
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    customerStoreSearch,
    setCustomerStoreSearch,
    customerStoreVisibility,
    setCustomerStoreVisibility,
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
    selectedMenuItemConfigurations,
    setSelectedMenuItemConfigurations,
    menuItemConfigurationModal,
    setMenuItemConfigurationModal,
    seenCustomerProfileNoticeIds,
    setSeenCustomerProfileNoticeIds,
  }
}

export function useMerchantPageState() {
  const [merchantProfileDraft, setMerchantProfileDraft] = useState<MerchantProfileDraft>(
    createInitialMerchantProfileDraft(),
  )
  const [merchantProfileFormErrors, setMerchantProfileFormErrors] = useState<
    Partial<Record<MerchantProfileFormField, DisplayText>>
  >({})
  const [merchantWithdrawAmount, setMerchantWithdrawAmount] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [merchantWithdrawFieldError, setMerchantWithdrawFieldError] = useState<DisplayText | null>(null)
  const [merchantDraft, setMerchantDraft] = useState<MerchantDraft>(createInitialMerchantDraft())
  const [merchantFormErrors, setMerchantFormErrors] = useState<
    Partial<Record<MerchantFormField, DisplayText>>
  >({})
  const [isMerchantImageUploading, setIsMerchantImageUploading] = useState(false)
  const [menuItemDrafts, setMenuItemDrafts] = useState<Record<StoreId, MenuItemDraft>>({})
  const [menuComposerOpen, setMenuComposerOpen] = useState<Record<StoreId, boolean>>({})
  const [menuItemFormErrors, setMenuItemFormErrors] = useState<
    Record<StoreId, Partial<Record<MenuItemFormField, DisplayText>>>
  >({})
  const [menuItemImageUploading, setMenuItemImageUploading] = useState<Record<StoreId, boolean>>(
    {},
  )
  const [merchantAppealDrafts, setMerchantAppealDrafts] = useState<Record<OrderId, DisplayText>>({})
  const [eligibilityReviewDrafts, setEligibilityReviewDrafts] = useState<
    Record<StoreId | RiderId, DisplayText>
  >(
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

export function useReviewAndTicketState() {
  const [orderChatDrafts, setOrderChatDrafts] = useState<Record<OrderId, DisplayText>>({})
  const [orderChatErrors, setOrderChatErrors] = useState<Record<OrderId, DisplayText>>({})
  const [reviewDrafts, setReviewDrafts] = useState<Record<ReviewDraftKey, ReviewDraft>>({})
  const [reviewErrors, setReviewErrors] = useState<Record<ReviewDraftKey, DisplayText>>({})
  const [partialRefundDrafts, setPartialRefundDrafts] = useState<
    Record<PartialRefundDraftKey, PartialRefundDraft>
  >({})
  const [partialRefundErrors, setPartialRefundErrors] = useState<
    Record<PartialRefundDraftKey, DisplayText>
  >({})
  const [afterSalesDrafts, setAfterSalesDrafts] = useState<Record<OrderId, AfterSalesDraft>>({})
  const [afterSalesErrors, setAfterSalesErrors] = useState<Record<OrderId, DisplayText>>({})
  const [partialRefundResolutionDrafts, setPartialRefundResolutionDrafts] = useState<
    Record<RefundRequestId, DisplayText>
  >({})
  const [applicationReviewDrafts, setApplicationReviewDrafts] = useState<
    Record<MerchantApplicationId, DisplayText>
  >({})
  const [afterSalesResolutionDrafts, setAfterSalesResolutionDrafts] = useState<
    Record<TicketId, AfterSalesResolutionDraft>
  >({})
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<OrderId, ResolveTicketRequest>>(
    {},
  )
  const [riderAppealDrafts, setRiderAppealDrafts] = useState<Record<OrderId, DisplayText>>({})
  const [appealResolutionDrafts, setAppealResolutionDrafts] = useState<
    Record<ReviewAppealId, AppealResolutionDraft>
  >({})
  const [eligibilityResolutionDrafts, setEligibilityResolutionDrafts] = useState<
    Record<EligibilityReviewId, AppealResolutionDraft>
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
