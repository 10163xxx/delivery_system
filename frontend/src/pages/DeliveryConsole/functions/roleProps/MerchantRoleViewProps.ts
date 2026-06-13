import type {
  MerchantPropsArgs,
  PageView,
} from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
import { getSharedFormattingProps } from '@/pages/DeliveryConsole/functions/roleProps/SharedFormattingProps'

export function getMerchantViewIdentityProps(
  pageView: PageView,
  navigate: MerchantPropsArgs['navigate'],
) {
  return {
    currentDisplayName: pageView.currentDisplayName,
    merchantProfile: pageView.merchantProfile,
    navigate,
    role: pageView.role,
    statusLabels: pageView.statusLabels,
    ...getSharedFormattingProps(pageView),
  }
}

export function getMerchantViewWorkspaceProps(pageView: PageView) {
  return {
    enterMerchantStore: pageView.enterMerchantStore,
    leaveMerchantStore: pageView.leaveMerchantStore,
    merchantApplicationView: pageView.merchantApplicationView,
    merchantMonthlyTrend: pageView.merchantMonthlyTrend,
    merchantWorkspaceView: pageView.merchantWorkspaceView,
    merchantWithdrawError: pageView.merchantWithdrawError,
    setMerchantApplicationViewState: pageView.setMerchantApplicationViewState,
    setMerchantWorkspaceViewState: pageView.setMerchantWorkspaceViewState,
  }
}

export function getMerchantViewStoreProps(pageView: PageView) {
  return {
    merchantPendingApplications: pageView.merchantPendingApplications,
    merchantReviewedApplications: pageView.merchantReviewedApplications,
    merchantStores: pageView.merchantStores,
    monthlySalesByMenuItem: pageView.monthlySalesByMenuItem,
    STORE_CATEGORIES: pageView.STORE_CATEGORIES,
  }
}
