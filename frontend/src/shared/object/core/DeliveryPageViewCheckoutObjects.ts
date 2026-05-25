import type { getDeliveryConsolePageViewDerived } from '@/shared/app/delivery/DeliveryPageViewDerived'
import type { CouponId, DisplayText, MenuItemId } from '@/shared/object/core/SharedObjects'

export type CheckoutSummaryArgs = {
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  customerRequiresDefaultAddressUpdate: boolean
  quantities: Record<MenuItemId, number>
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
