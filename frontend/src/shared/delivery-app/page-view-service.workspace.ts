import { getCustomerWorkspaceView, getMerchantApplicationViewFromUrl, getMerchantWorkspaceViewFromUrl } from './page-view-service.route'

export function getWorkspaceViews(
  locationPathname: string,
  searchParams: URLSearchParams,
  merchantWorkspaceState: ReturnType<typeof getMerchantWorkspaceViewFromUrl>,
  merchantApplicationState: ReturnType<typeof getMerchantApplicationViewFromUrl>,
) {
  const customerWorkspaceView = getCustomerWorkspaceView(locationPathname)
  const merchantWorkspaceViewFromUrl = getMerchantWorkspaceViewFromUrl(locationPathname)
  const merchantApplicationViewFromUrl = getMerchantApplicationViewFromUrl(searchParams)

  return {
    customerWorkspaceView,
    merchantWorkspaceViewFromUrl,
    merchantApplicationViewFromUrl,
    merchantWorkspaceView: merchantWorkspaceState || merchantWorkspaceViewFromUrl,
    merchantApplicationView: merchantApplicationState || merchantApplicationViewFromUrl,
  }
}
