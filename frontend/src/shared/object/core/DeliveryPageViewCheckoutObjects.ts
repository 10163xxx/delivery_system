import type { getDeliveryConsolePageViewDerived } from '@/shared/app/delivery/DeliveryPageViewDerived'

export type CheckoutSummaryArgs = {
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  customerRequiresDefaultAddressUpdate: boolean
  quantities: Record<string, number>
  selectedCouponId: string
}

export type PaymentFieldStateArgs = {
  customRechargeAmount: string
  selectedRechargeAmount: number | null
  rechargeFieldError: string | null
  merchantWithdrawAmount: string
  merchantWithdrawFieldError: string | null
  merchantProfile: ReturnType<typeof getDeliveryConsolePageViewDerived>['merchantProfile']
}
