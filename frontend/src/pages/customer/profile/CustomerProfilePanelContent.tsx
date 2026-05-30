import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { CustomerProfileAddressesPanel } from '@/pages/customer/profile/CustomerProfileAddressesPanel'
import { CustomerProfileCouponsPanel } from '@/pages/customer/profile/CustomerProfileCouponsPanel'
import { CustomerProfileOverviewPanel } from '@/pages/customer/profile/CustomerProfileOverviewPanel'
import { CustomerProfileRechargePanel } from '@/pages/customer/profile/CustomerProfileRechargePanel'
import { CustomerProfileRefundsPanel } from '@/pages/customer/profile/CustomerProfileRefundsPanel'
import {
  CustomerProfileBlockedStoresPanel,
  CustomerProfileFavoritesPanel,
} from '@/pages/customer/profile/CustomerProfileStorePreferencePanels'
import { CUSTOMER_WORKSPACE_VIEW } from '@/objects/page/DeliveryAppObjects'

export function CustomerProfilePanelContent(props: CustomerRoleProps) {
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.recharge) return <CustomerProfileRechargePanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.coupons) return <CustomerProfileCouponsPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.addresses) return <CustomerProfileAddressesPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.refunds) return <CustomerProfileRefundsPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.favorites) return <CustomerProfileFavoritesPanel props={props} />
  if (props.customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.blockedStores) return <CustomerProfileBlockedStoresPanel props={props} />
  return <CustomerProfileOverviewPanel props={props} />
}
