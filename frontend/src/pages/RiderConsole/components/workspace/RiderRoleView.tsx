import { useState } from 'react'
import type { RiderRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { OrderList } from '@/pages/OrderConsole/components/OrderList'
import { RiderAcceptanceWorkspace } from '@/pages/RiderConsole/components/workspace/RiderAcceptanceWorkspace'
import { RiderConsoleWorkspace } from '@/pages/RiderConsole/components/workspace/RiderConsoleWorkspace'
import { RiderProfileWorkspace } from '@/pages/RiderConsole/components/profile/RiderProfileWorkspace'
import { RiderWorkspaceTabs } from '@/pages/RiderConsole/components/workspace/RiderWorkspaceTabs'
import { getVisibleRiders } from '@/pages/RiderConsole/components/workspace/RiderVisibility'
import {
  RIDER_CONSOLE_COPY,
  RIDER_WORKSPACE_VIEW,
  type RiderWorkspaceView,
} from '@/pages/RiderConsole/objects/RiderWorkspaceObjects'

type RiderProfileSection = 'overview' | 'history' | 'withdraw'

export function RiderRoleView(props: RiderRoleProps) {
  const {
    formatPrice,
    formatTime,
    selectedRider,
    runAction,
    updateRiderProfile,
    withdrawRiderIncome,
    BANK_OPTIONS,
  } = props
  const [workspaceView, setWorkspaceView] = useState<RiderWorkspaceView>(RIDER_WORKSPACE_VIEW.console)
  const [profileSection, setProfileSection] = useState<RiderProfileSection>('overview')
  const visibleRiders = getVisibleRiders(props)

  return (
    <section className="panel-stack">
      <RiderWorkspaceTabs workspaceView={workspaceView} setWorkspaceView={setWorkspaceView} />

      {workspaceView === RIDER_WORKSPACE_VIEW.console ? (
        <RiderConsoleWorkspace props={props} visibleRiders={visibleRiders} />
      ) : workspaceView === RIDER_WORKSPACE_VIEW.acceptance ? (
        <RiderAcceptanceWorkspace props={props} />
      ) : (
        <Panel
          title={RIDER_CONSOLE_COPY.profilePanel.title}
          description={RIDER_CONSOLE_COPY.profilePanel.description}
        >
          {selectedRider ? (
            <>
              <div className="metrics-grid">
                <div className="metric-card">
                  <span>累计收入</span>
                  <strong>{formatPrice(selectedRider.earningsCents)}</strong>
                </div>
                <div className="metric-card">
                  <span>已提现</span>
                  <strong>{formatPrice(selectedRider.withdrawnCents)}</strong>
                </div>
                <div className="metric-card">
                  <span>可提现余额</span>
                  <strong>{formatPrice(selectedRider.availableToWithdrawCents)}</strong>
                </div>
                <div className="metric-card">
                  <span>配送区域</span>
                  <strong>{selectedRider.zone}</strong>
                </div>
              </div>
              <div className="summary-bar">
                <button
                  className={profileSection === 'overview' ? 'primary-button' : 'secondary-button'}
                  onClick={() => setProfileSection('overview')}
                  type="button"
                >
                  {RIDER_CONSOLE_COPY.profilePanel.overviewButton}
                </button>
                <button
                  className={profileSection === 'history' ? 'primary-button' : 'secondary-button'}
                  onClick={() => setProfileSection('history')}
                  type="button"
                >
                  {RIDER_CONSOLE_COPY.profilePanel.historyButton}
                </button>
                <button
                  className={profileSection === 'withdraw' ? 'primary-button' : 'secondary-button'}
                  onClick={() => setProfileSection('withdraw')}
                  type="button"
                >
                  {RIDER_CONSOLE_COPY.profilePanel.withdrawButton}
                </button>
              </div>
              {profileSection === 'history' ? (
                <Panel
                  title={RIDER_CONSOLE_COPY.profilePanel.historyTitle}
                  description={RIDER_CONSOLE_COPY.profilePanel.historyDescription}
                >
                  <OrderList
                    orders={props.riderHistoryOrders}
                    emptyText={RIDER_CONSOLE_COPY.profilePanel.emptyHistoryOrders}
                    formatPrice={formatPrice}
                    formatTime={formatTime}
                    statusLabels={props.statusLabels}
                  />
                </Panel>
              ) : profileSection === 'withdraw' ? (
                <RiderProfileWorkspace
                  key={selectedRider.id}
                  BANK_OPTIONS={BANK_OPTIONS}
                  formatPrice={formatPrice}
                  formatTime={formatTime}
                  runAction={runAction}
                  selectedRider={selectedRider}
                  updateRiderProfile={updateRiderProfile}
                  withdrawRiderIncome={withdrawRiderIncome}
                />
              ) : null}
            </>
          ) : (
            <div className="empty-card">当前没有可用的骑手资料。</div>
          )}
        </Panel>
      )}
    </section>
  )
}
