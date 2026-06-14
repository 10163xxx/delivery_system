import type { DisplayText } from '@/objects/core/SharedObjects'
import { ROUTE_PATH, ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'
import type { RoutePathValue } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import { MERCHANT_APPLICATION_VIEW } from '@/pages/DeliveryConsole/objects/merchantWorkspace/MerchantWorkspaceViewObjects'

export type MerchantRoutePath =
  | typeof ROUTE_PATH.merchantApplication
  | typeof ROUTE_PATH.merchantApplicationSubmit
  | typeof ROUTE_PATH.merchantStore
  | typeof ROUTE_PATH.merchantOrders
  | typeof ROUTE_PATH.merchantConsole
  | typeof ROUTE_PATH.merchantProfile
  | typeof ROUTE_PATH.merchantProfileAnalytics

export function buildMerchantApplicationSubmitRoute(): typeof ROUTE_PATH.merchantApplicationSubmit {
  return `${ROUTE_PATH.merchantApplication}?${ROUTE_QUERY_KEY.merchantView}=${MERCHANT_APPLICATION_VIEW.submit}`
}

export type MerchantWorkspaceRouteMeta = {
  title: DisplayText
  path: RoutePathValue
  resetStoreSelection: boolean
}
