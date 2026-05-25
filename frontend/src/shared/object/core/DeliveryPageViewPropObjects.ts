import type { getTodayDeliveryWindowAction } from '@/shared/app/delivery/DeliveryPageViewActions'
import type { getDeliveryConsolePageViewDerived } from '@/shared/app/delivery/DeliveryPageViewDerived'
import type { getWorkspaceViews } from '@/shared/app/delivery/DeliveryPageViewWorkspace'
import type { DeliveryPageViewParams } from '@/shared/object/core/DeliveryPageObjects'
import type { MenuItemId, Role } from '@/shared/object/core/SharedObjects'
type PaymentFieldState = {
  parsedRechargeAmount: number | null
  rechargeAmountError: string | null
  rechargeAmountPreview: number | null
  merchantWithdrawError: string | null
}

type CheckoutSummaryState = {
  cartSubtotal: number
  cartTotal: number
  availableCheckoutCoupons: NonNullable<ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']>['coupons']
  selectedCoupon: NonNullable<ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']>['coupons'][number] | null
  couponDiscountCents: number
  payableTotalCents: number
  selectedStoreHasMenu: boolean
  selectedStoreCanOrder: boolean
  remainingBalanceAfterCheckout: number | null
}

export type PageActionArgsInput = {
  state: DeliveryPageViewParams['sessionService']['state']
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  quantities: Record<MenuItemId, number>
  selectedMenuItemConfigurations: Record<MenuItemId, import('@/shared/object/core/DeliveryAppObjects').SelectedMenuItemConfiguration>
  scheduledDeliveryTime: string
  pageState: DeliveryPageViewParams['pageState']
  setError: DeliveryPageViewParams['sessionService']['setError']
  navigate: DeliveryPageViewParams['navigate']
  setSearchParams: DeliveryPageViewParams['setSearchParams']
}

type PageViewIdentityInput = {
  role: Role
  workspaceViews: ReturnType<typeof getWorkspaceViews>
  derived: ReturnType<typeof getDeliveryConsolePageViewDerived>
  currentDisplayName: string
  pageState: DeliveryPageViewParams['pageState']
}

type PageViewDerivedInput = {
  paymentFieldState: PaymentFieldState
  checkoutSummary: CheckoutSummaryState
  todayDeliveryWindow: ReturnType<typeof getTodayDeliveryWindowAction>
  customerStoreSearchHistory: string[]
  seenCustomerProfileNoticeIds: string[]
}

export type PageViewDataInput = PageViewIdentityInput & PageViewDerivedInput

export type PageViewActionInput = {
  actionArgs: ReturnType<typeof import('@/shared/app/delivery/DeliveryPageViewProps').buildPageActionArgs>
  todayDeliveryWindow: ReturnType<typeof getTodayDeliveryWindowAction>
  setMerchantWorkspaceState: DeliveryPageViewParams['pageState']['setMerchantWorkspaceState']
  setMerchantApplicationState: DeliveryPageViewParams['pageState']['setMerchantApplicationState']
}
