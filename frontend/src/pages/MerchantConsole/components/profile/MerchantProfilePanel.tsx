import { useLocation } from 'react-router-dom'
import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { MerchantProfileAnalyticsPage } from '@/pages/MerchantConsole/components/profile/MerchantProfileAnalyticsPage'
import { MerchantProfileOverviewPanel } from '@/pages/MerchantConsole/components/profile/MerchantProfileOverviewPanel'
import { ROUTE_PATH } from '@/objects/core/SharedObjects'

export function MerchantProfilePanel(props: MerchantRoleProps) {
  const location = useLocation()

  if (location.pathname === ROUTE_PATH.merchantProfileAnalytics) {
    return <MerchantProfileAnalyticsPage {...props} />
  }

  return <MerchantProfileOverviewPanel {...props} />
}
