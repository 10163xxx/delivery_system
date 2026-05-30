import type { MerchantRoleProps } from '@/pages/delivery/app/roleProps'
import type { MerchantConsolePanelProps } from '@/pages/merchant/hooks/MerchantConsoleState'
import type { Store } from '@/objects/core/SharedObjects'

export type MerchantTrendPoint = MerchantRoleProps['merchantMonthlyTrend'][number]
export const MERCHANT_STORE_SUB_VIEW = {
  menu: 'menu',
  orders: 'orders',
} as const

export type MerchantStoreSubView =
  (typeof MERCHANT_STORE_SUB_VIEW)[keyof typeof MERCHANT_STORE_SUB_VIEW]

export type MerchantProfileFormProps = Pick<
  MerchantRoleProps,
  | 'BANK_OPTIONS'
  | 'merchantProfileDraft'
  | 'merchantProfileFormErrors'
  | 'setMerchantProfileDraft'
  | 'setMerchantProfileFormErrors'
>

export type MerchantProfileOverviewMetricsProps = Pick<
  MerchantRoleProps,
  'formatPrice' | 'merchantProfile' | 'merchantStores'
>

export type MerchantProfileOverviewSidebarProps = Pick<
  MerchantRoleProps,
  | 'formatPrice'
  | 'merchantMonthlyTrend'
  | 'merchantPendingApplications'
  | 'merchantProfile'
  | 'merchantReviewedApplications'
  | 'merchantStores'
  | 'navigate'
>

export type MerchantProfileWithdrawalSectionProps = Pick<
  MerchantRoleProps,
  | 'formatPrice'
  | 'formatTime'
  | 'merchantProfile'
  | 'merchantWithdrawAmount'
  | 'merchantWithdrawError'
  | 'setMerchantWithdrawAmount'
  | 'setMerchantWithdrawFieldError'
  | 'withdrawMerchantIncome'
>

export type MerchantMenuSectionComposerProps = {
  store: Store
  props: MerchantConsolePanelProps
}
