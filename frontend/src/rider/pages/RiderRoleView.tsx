import { useState } from 'react'
import type { RiderRoleProps } from '@/shared/AppBuildRoleProps'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { RiderConsoleWorkspace } from '@/rider/pages/RiderConsoleWorkspace'
import { RiderProfileWorkspace } from '@/rider/pages/RiderProfileWorkspace'
import { RiderWorkspaceTabs } from '@/rider/pages/RiderWorkspaceTabs'
import {
  getVisibleRiders,
  RIDER_CONSOLE_COPY,
  type RiderWorkspaceView,
} from '@/rider/app/RiderSupport'

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
  const [workspaceView, setWorkspaceView] = useState<RiderWorkspaceView>('console')
  const visibleRiders = getVisibleRiders(props)

  return (
    <section className="panel-stack">
      <RiderWorkspaceTabs workspaceView={workspaceView} setWorkspaceView={setWorkspaceView} />

      {workspaceView === 'console' ? (
        <RiderConsoleWorkspace props={props} visibleRiders={visibleRiders} />
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
            </>
          ) : (
            <div className="empty-card">当前没有可用的骑手资料。</div>
          )}
        </Panel>
      )}
    </section>
  )
}
