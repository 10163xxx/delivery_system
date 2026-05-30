import type { getDeliveryConsolePageViewDerived } from '@/pages/delivery/app/DeliveryPageViewDerived'
import type { CouponId, DisplayText, MenuItemId } from '@/objects/core/SharedObjects'

export type CheckoutSummaryArgs = {
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  customerRequiresDefaultAddressUpdate: boolean
  deliveryAddress: DisplayText
  quantities: Record<MenuItemId, number>
  selectedMenuItemConfigurations: Record<MenuItemId, import('@/objects/page/DeliveryAppObjects').SelectedMenuItemConfiguration>
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
