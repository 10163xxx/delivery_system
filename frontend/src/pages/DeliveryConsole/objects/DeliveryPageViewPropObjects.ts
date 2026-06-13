import type { getTodayDeliveryWindowAction } from '@/pages/DeliveryConsole/functions/DeliveryPageViewActions'
import type { getDeliveryConsolePageViewDerived } from '@/pages/DeliveryConsole/functions/DeliveryPageViewDerived'
import type { getWorkspaceViews } from '@/pages/DeliveryConsole/functions/DeliveryPageViewWorkspace'
import type { DeliveryPageViewParams } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import type {
  DisplayText,
  IsoDateTime,
  MenuItemId,
  PersonName,
  Role,
} from '@/objects/core/SharedObjects'
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
  deliveryFeeCents: number
  payableTotalCents: number
  selectedStoreDeliveryDistanceKm: number | null
  selectedStoreDeliveryDistanceLabel: string | null
  selectedStoreDistanceCategory: string | null
  selectedStoreIsDeliverable: boolean
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
  selectedMenuItemConfigurations: Record<MenuItemId, import('@/pages/DeliveryConsole/objects/DeliveryDraftObjects').SelectedMenuItemConfiguration>
  scheduledDeliveryTime: DisplayText | IsoDateTime
  pageState: DeliveryPageViewParams['pageState']
  setError: DeliveryPageViewParams['sessionService']['setError']
  navigate: DeliveryPageViewParams['navigate']
  setSearchParams: DeliveryPageViewParams['setSearchParams']
}

type PageViewIdentityInput = {
  role: Role
  workspaceViews: ReturnType<typeof getWorkspaceViews>
  derived: ReturnType<typeof getDeliveryConsolePageViewDerived>
  currentDisplayName: PersonName
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
  actionArgs: ReturnType<typeof import('@/pages/DeliveryConsole/functions/DeliveryPageViewProps').buildPageActionArgs>
  todayDeliveryWindow: ReturnType<typeof getTodayDeliveryWindowAction>
  setMerchantWorkspaceState: DeliveryPageViewParams['pageState']['setMerchantWorkspaceState']
  setMerchantApplicationState: DeliveryPageViewParams['pageState']['setMerchantApplicationState']
}
