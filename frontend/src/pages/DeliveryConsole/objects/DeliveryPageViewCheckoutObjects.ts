import type { getDeliveryConsolePageViewDerived } from '@/pages/DeliveryConsole/functions/DeliveryPageViewDerived'
import type { AddressText, CouponId, DisplayText, MenuItemId } from '@/objects/core/SharedObjects'

export type CheckoutSummaryArgs = {
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  customerRequiresDefaultAddressUpdate: boolean
  deliveryAddress: AddressText
  quantities: Record<MenuItemId, number>
  selectedMenuItemConfigurations: Record<MenuItemId, import('@/pages/DeliveryConsole/objects/DeliveryDraftObjects').SelectedMenuItemConfiguration>
  selectedCouponId: CouponId | ''
}

export type PaymentFieldStateArgs = {
  customRechargeAmount: DisplayText
  selectedRechargeAmount: number | null
  rechargeFieldError: DisplayText | null
  merchantWithdrawAmount: DisplayText
  merchantWithdrawFieldError: DisplayText | null
  merchantProfile: ReturnType<typeof getDeliveryConsolePageViewDerived>['merchantProfile']
}
