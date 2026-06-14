import type { Dispatch, SetStateAction } from 'react'
import type {
  AddressText,
  CouponId,
  DisplayText,
  IsoDateTime,
  MenuItemId,
  StoreId,
} from '@/objects/core/SharedObjects'
import type {
  MenuItemConfigurationModalState,
  SelectedMenuItemConfiguration,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'

export type CustomerCheckoutState = {
  quantities: Record<MenuItemId, number>
  selectedMenuItemConfigurations: Record<MenuItemId, SelectedMenuItemConfiguration>
  menuItemConfigurationModal: MenuItemConfigurationModalState | null
  deliveryAddress: AddressText
  scheduledDeliveryTime: DisplayText | IsoDateTime
  scheduledDeliveryTouched: boolean
  remark: DisplayText
  payableTotalCents: number
}

export type CustomerCheckoutSetters = {
  setDeliveryAddressError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryError: Dispatch<SetStateAction<DisplayText | null>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<DisplayText | IsoDateTime>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
}

export type CustomerCheckoutInteractionSetters = {
  setRemark: Dispatch<SetStateAction<DisplayText>>
  setQuantities: Dispatch<SetStateAction<Record<MenuItemId, number>>>
  setSelectedMenuItemConfigurations: Dispatch<
    SetStateAction<Record<MenuItemId, SelectedMenuItemConfiguration>>
  >
}

export type CustomerCheckoutUiSetters = {
  setMenuItemConfigurationModal: Dispatch<SetStateAction<MenuItemConfigurationModalState | null>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setSelectedCouponId: Dispatch<SetStateAction<CouponId | ''>>
  setSelectedStoreCategory: Dispatch<SetStateAction<DisplayText>>
  setSelectedStoreId: Dispatch<SetStateAction<StoreId | ''>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
}
