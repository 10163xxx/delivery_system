import type { Dispatch, SetStateAction } from 'react'
import type {
  AuthSession,
  AddressText,
  CouponId,
  CustomerId,
  DeliveryAppState,
  DisplayText,
  IsoDateTime,
  MenuItemId,
  OrderId,
  PersonName,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import type {
  AfterSalesDraft,
  MenuItemConfigurationModalState,
  PartialRefundDraft,
  PartialRefundDraftKey,
  ReviewDraft,
  ReviewDraftKey,
  SelectedMenuItemConfiguration,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { CustomerAddressDraft, CustomerAddressField } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

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
  deliveryAddress: AddressText
  scheduledDeliveryTime: DisplayText | IsoDateTime
  scheduledDeliveryTouched: boolean
  remark: DisplayText
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
  selectedRechargeAmount: number | null
}

type CustomerActionServices = {
  runAction: RunAction
  navigate: (to: string, options?: { replace?: boolean }) => void
}

type CustomerSearchState = {
  activeCustomerId: CustomerId | ''
  customerStoreSearchDraft: DisplayText
  favoriteStoreIds: StoreId[]
  blockedStoreIds: StoreId[]
  setCustomerStoreSearchDraft: Dispatch<SetStateAction<DisplayText>>
  setCustomerStoreSearch: Dispatch<SetStateAction<DisplayText>>
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  setFavoriteStoreIds: Dispatch<SetStateAction<StoreId[]>>
  setBlockedStoreIds: Dispatch<SetStateAction<StoreId[]>>
}

type CustomerCheckoutSetters = {
  setDeliveryAddressError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<DisplayText | IsoDateTime>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
}

type CustomerCheckoutInteractionSetters = {
  setRemark: Dispatch<SetStateAction<DisplayText>>
  setQuantities: Dispatch<SetStateAction<Record<MenuItemId, number>>>
  setSelectedMenuItemConfigurations: Dispatch<
    SetStateAction<Record<MenuItemId, SelectedMenuItemConfiguration>>
  >
}

type CustomerCheckoutUiSetters = {
  setMenuItemConfigurationModal: Dispatch<SetStateAction<MenuItemConfigurationModalState | null>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setSelectedCouponId: Dispatch<SetStateAction<CouponId | ''>>
  setSelectedStoreCategory: Dispatch<SetStateAction<DisplayText>>
  setSelectedStoreId: Dispatch<SetStateAction<StoreId | ''>>
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
