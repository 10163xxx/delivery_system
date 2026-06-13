import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { CustomerProfileAddressesPanel } from '@/pages/CustomerConsole/components/profile/CustomerProfileAddressesPanel'
import { CustomerProfileCouponsPanel } from '@/pages/CustomerConsole/components/profile/CustomerProfileCouponsPanel'
import { CustomerProfileOverviewPanel } from '@/pages/CustomerConsole/components/profile/CustomerProfileOverviewPanel'
import { CustomerProfileRechargePanel } from '@/pages/CustomerConsole/components/profile/CustomerProfileRechargePanel'
import { CustomerProfileRefundsPanel } from '@/pages/CustomerConsole/components/profile/CustomerProfileRefundsPanel'
import {
  CustomerProfileBlockedStoresPanel,
  CustomerProfileFavoritesPanel,
} from '@/pages/CustomerConsole/components/profile/CustomerProfileStorePreferencePanels'
import { CUSTOMER_WORKSPACE_VIEW } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export function CustomerProfilePanelContent(props: CustomerRoleProps) {
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.recharge) return <CustomerProfileRechargePanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.coupons) return <CustomerProfileCouponsPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.addresses) return <CustomerProfileAddressesPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.refunds) return <CustomerProfileRefundsPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.favorites) return <CustomerProfileFavoritesPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.blockedStores) return <CustomerProfileBlockedStoresPanel props={props} />
  return <CustomerProfileOverviewPanel props={props} />
}
