import type { Dispatch, SetStateAction } from 'react'
import type {
  AuthSession,
  CouponId,
  CustomerId,
  DeliveryAppState,
  DisplayText,
  MenuItemId,
  OrderId,
  PersonName,
  Store,
} from '@/objects/core/SharedObjects'
import type {
  AfterSalesDraft,
  CustomerAddressDraft,
  CustomerAddressField,
  MenuItemConfigurationModalState,
  PartialRefundDraftKey,
  PartialRefundDraft,
  ReviewDraftKey,
  ReviewDraft,
  SelectedMenuItemConfiguration,
} from '@/objects/page/DeliveryAppObjects'

export type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

type CustomerActionState = {
  state: DeliveryAppState | null
  selectedStore: Store | undefined
  selectedStoreIsOpen: boolean
  selectedCustomer: DeliveryAppState['customers'][number] | undefined
  selectedCoupon: DeliveryAppState['customers'][number]['coupons'][number] | null
  customerRequiresDefaultAddressUpdate: boolean
}

type CustomerCheckoutState = {
  quantities: Record<MenuItemId, number>
  selectedMenuItemConfigurations: Record<MenuItemId, SelectedMenuItemConfiguration>
  menuItemConfigurationModal: MenuItemConfigurationModalState | null
  deliveryAddress: string
  scheduledDeliveryTime: string
  scheduledDeliveryTouched: boolean
  remark: string
  payableTotalCents: number
}

type CustomerDraftState = {
  partialRefundDrafts: Record<PartialRefundDraftKey, PartialRefundDraft>
  afterSalesDrafts: Record<OrderId, AfterSalesDraft>
  reviewDrafts: Record<ReviewDraftKey, ReviewDraft>
  orderChatDrafts: Record<OrderId, DisplayText>
  customerNameDraft: PersonName
  addressDraft: CustomerAddressDraft
  customRechargeAmount: DisplayText
}

type CustomerActionServices = {
  runAction: RunAction
  navigate: (to: string, options?: { replace?: boolean }) => void
}

type CustomerSearchState = {
  activeCustomerId: CustomerId | ''
  customerStoreSearchDraft: DisplayText
  favoriteStoreIds: string[]
  blockedStoreIds: string[]
  setCustomerStoreSearchDraft: Dispatch<SetStateAction<DisplayText>>
  setCustomerStoreSearch: Dispatch<SetStateAction<DisplayText>>
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  setFavoriteStoreIds: Dispatch<SetStateAction<string[]>>
  setBlockedStoreIds: Dispatch<SetStateAction<string[]>>
}

type CustomerCheckoutSetters = {
  setDeliveryAddressError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<string>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
}

type CustomerCheckoutInteractionSetters = {
  setRemark: Dispatch<SetStateAction<string>>
  setQuantities: Dispatch<SetStateAction<Record<MenuItemId, number>>>
  setSelectedMenuItemConfigurations: Dispatch<
    SetStateAction<Record<MenuItemId, SelectedMenuItemConfiguration>>
  >
}

type CustomerCheckoutUiSetters = {
  setMenuItemConfigurationModal: Dispatch<SetStateAction<MenuItemConfigurationModalState | null>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setSelectedCouponId: Dispatch<SetStateAction<CouponId | ''>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
}

type CustomerDraftSetters = {
  setOrderChatErrors: Dispatch<SetStateAction<Record<OrderId, DisplayText>>>
  setOrderChatDrafts: Dispatch<SetStateAction<Record<OrderId, DisplayText>>>
  setPartialRefundErrors: Dispatch<SetStateAction<Record<PartialRefundDraftKey, DisplayText>>>
  setPartialRefundDrafts: Dispatch<SetStateAction<Record<PartialRefundDraftKey, PartialRefundDraft>>>
  setAfterSalesErrors: Dispatch<SetStateAction<Record<OrderId, DisplayText>>>
  setAfterSalesDrafts: Dispatch<SetStateAction<Record<OrderId, AfterSalesDraft>>>
  setReviewErrors: Dispatch<SetStateAction<Record<ReviewDraftKey, DisplayText>>>
  setReviewDrafts: Dispatch<SetStateAction<Record<ReviewDraftKey, ReviewDraft>>>
  setAddressFormErrors: Dispatch<SetStateAction<Partial<Record<CustomerAddressField, DisplayText>>>>
}

type CustomerAccountSetters = {
  setAddressDraft: Dispatch<SetStateAction<CustomerAddressDraft>>
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setCustomRechargeAmount: Dispatch<SetStateAction<DisplayText>>
  setSelectedRechargeAmount: Dispatch<SetStateAction<number | null>>
  setRechargeFieldError: Dispatch<SetStateAction<DisplayText | null>>
}

export type CustomerActionParams = CustomerActionState &
  CustomerCheckoutState &
  CustomerDraftState &
  CustomerActionServices &
  CustomerSearchState &
  CustomerCheckoutSetters &
  CustomerCheckoutInteractionSetters &
  CustomerCheckoutUiSetters &
  CustomerDraftSetters &
  CustomerAccountSetters
