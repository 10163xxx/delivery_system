import { useLocation } from 'react-router-dom'
import type { MerchantRoleProps } from '@/shared/app/role-props'
import { MerchantProfileAnalyticsPage } from '@/pages/merchant/profile/MerchantProfileAnalyticsPage'
import { MerchantProfileOverviewPanel } from '@/pages/merchant/profile/MerchantProfileOverviewPanel'

export function MerchantProfilePanel(props: MerchantRoleProps) {
  const location = useLocation()

  if (location.pathname === '/merchant/profile/analytics') {
    return <MerchantProfileAnalyticsPage {...props} />
  }

  return <MerchantProfileOverviewPanel {...props} />
}
