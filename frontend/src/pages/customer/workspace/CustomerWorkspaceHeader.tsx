import {
  CUSTOMER_WORKSPACE_HEADER_TABS,
  CUSTOMER_WORKSPACE_VIEW_META,
} from '@/shared/components/primitives/DeliveryConsoleCopy'
import { CUSTOMER_WORKSPACE_VIEW } from '@/shared/object/core/DeliveryAppObjects'
import type { CustomerWorkspaceHeaderProps } from '@/pages/customer/object/CustomerPageObjects'

export function CustomerWorkspaceHeader({
  customerWorkspaceView,
  customerProfileNoticeCount,
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
          className={activeView.activeTab === CUSTOMER_WORKSPACE_VIEW.order ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate(CUSTOMER_WORKSPACE_HEADER_TABS.order.route)}
          type="button"
        >
          {CUSTOMER_WORKSPACE_HEADER_TABS.order.label}
        </button>
        <button
          className={activeView.activeTab === CUSTOMER_WORKSPACE_VIEW.orders ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate(CUSTOMER_WORKSPACE_HEADER_TABS.orders.route)}
          type="button"
        >
          {CUSTOMER_WORKSPACE_HEADER_TABS.orders.label}
        </button>
        <button
          className={activeView.activeTab === CUSTOMER_WORKSPACE_VIEW.profile ? 'primary-button' : 'secondary-button'}
          onClick={() => navigate(CUSTOMER_WORKSPACE_HEADER_TABS.profile.route)}
          type="button"
        >
          <span className="header-tab-button">
            <span className="header-tab-label">{CUSTOMER_WORKSPACE_HEADER_TABS.profile.label}</span>
            {customerProfileNoticeCount > 0 ? (
              <span className="header-tab-notice-badge">{customerProfileNoticeCount}</span>
            ) : null}
          </span>
        </button>
      </div>
    </div>
  )
}
