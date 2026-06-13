import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { MerchantConsolePanelProps } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import type { Store } from '@/objects/core/SharedObjects'

export type MerchantTrendPoint = MerchantRoleProps['merchantMonthlyTrend'][number]

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
