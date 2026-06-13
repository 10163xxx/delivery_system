// Shared action argument shape for page-level handlers and split action modules.
import type { Dispatch, SetStateAction } from 'react'
import type {
  CouponId,
  DisplayText,
  IsoDateTime,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import type { CustomerStoreQueryRoutePath } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { MenuItemConfigurationModalState, ReviewDraft, SelectedMenuItemConfiguration } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { MerchantApplicationView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'

type ActionSelectionArgs = {
  state: { stores: Store[] } | null
  selectedStore: Store | undefined
  selectedCustomer: { coupons: { id: CouponId; minimumSpendCents: number }[] } | undefined
  selectedStoreIsOpen: boolean
  quantities: Record<string, number>
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration>
  scheduledDeliveryTime: IsoDateTime | DisplayText
}

type ActionRoutingArgs = {
  navigate: (path: CustomerStoreQueryRoutePath | string, options?: { replace?: boolean }) => void
  setSelectedStoreCategory: Dispatch<SetStateAction<DisplayText>>
  setSelectedStoreId: Dispatch<SetStateAction<StoreId | ''>>
  setSearchParams: (nextInit: URLSearchParams | Record<string, string>) => void
  setSelectedMerchantStoreId: Dispatch<SetStateAction<StoreId | ''>>
  setMerchantApplicationState: Dispatch<SetStateAction<MerchantApplicationView>>
}

type ActionFeedbackArgs = {
  setQuantities: Dispatch<SetStateAction<Record<string, number>>>
  setSelectedMenuItemConfigurations: Dispatch<
    SetStateAction<Record<string, SelectedMenuItemConfiguration>>
  >
  setMenuItemConfigurationModal: Dispatch<SetStateAction<MenuItemConfigurationModalState | null>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setRemark: Dispatch<SetStateAction<DisplayText>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<IsoDateTime | DisplayText>>
  setScheduledDeliveryError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
  setSelectedCouponId: Dispatch<SetStateAction<CouponId | ''>>
}

type ActionReviewArgs = {
  setReviewDrafts: Dispatch<SetStateAction<Record<string, ReviewDraft>>>
  setReviewErrors: Dispatch<SetStateAction<Record<string, DisplayText>>>
}

export type ActionArgs = ActionSelectionArgs &
  ActionRoutingArgs &
  ActionFeedbackArgs &
  ActionReviewArgs
