import type { NavigateFunction } from 'react-router-dom'
import {
  CUSTOMER_WORKSPACE_HEADER_TABS,
  CUSTOMER_WORKSPACE_VIEW_META,
} from '@/shared/components/DeliveryConsoleCopy'
import type { CustomerWorkspaceView } from '@/shared/delivery-app/DeliveryAppObjects'

type CustomerWorkspaceHeaderProps = {
  customerWorkspaceView: CustomerWorkspaceView
  navigate: NavigateFunction
}

export function CustomerWorkspaceHeader({
  customerWorkspaceView,
  navigate,
}: CustomerWorkspaceHeaderProps) {
  const activeView = CUSTOMER_WORKSPACE_VIEW_META[customerWorkspaceView]

  return (
    <div className="summary-bar">
      <div>
        <p>顾客工作台</p>
        <strong>{activeView.title}</strong>
      </div>
      <div className="action-row">
        <button
          className={activeView.activeTab === 'order' ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate(CUSTOMER_WORKSPACE_HEADER_TABS.order.route)}
          type="button"
        >
          {CUSTOMER_WORKSPACE_HEADER_TABS.order.label}
        </button>
        <button
          className={activeView.activeTab === 'orders' ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate(CUSTOMER_WORKSPACE_HEADER_TABS.orders.route)}
          type="button"
        >
          {CUSTOMER_WORKSPACE_HEADER_TABS.orders.label}
        </button>
        <button
          className={activeView.activeTab === 'profile' ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate(CUSTOMER_WORKSPACE_HEADER_TABS.profile.route)}
          type="button"
        >
          {CUSTOMER_WORKSPACE_HEADER_TABS.profile.label}
        </button>
      </div>
    </div>
  )
}
