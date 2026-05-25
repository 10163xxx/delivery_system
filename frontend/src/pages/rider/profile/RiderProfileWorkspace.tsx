import { useState } from 'react'
import { type RiderProfileDraft, type RiderProfileErrors } from '@/pages/rider/object/RiderWorkspaceObjects'
import type { RiderProfileWorkspaceProps } from '@/pages/rider/object/RiderPageObjects'
import { RiderProfileAccountSection, createInitialRiderProfileDraft } from '@/pages/rider/profile/RiderProfileAccountSection'
import { RiderProfileWithdrawSection } from '@/pages/rider/profile/RiderProfileWithdrawSection'

export function RiderProfileWorkspace({
  BANK_OPTIONS,
  formatPrice,
  formatTime,
  runAction,
  selectedRider,
  updateRiderProfile,
  withdrawRiderIncome,
}: RiderProfileWorkspaceProps) {
  const [profileDraft, setProfileDraft] = useState<RiderProfileDraft>(() => createInitialRiderProfileDraft(selectedRider))
  const [profileErrors, setProfileErrors] = useState<RiderProfileErrors>({})
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  return (
    <div className="merchant-store-module__layout">
      <aside className="merchant-store-sidebar">
        <section className="merchant-section-card">
          <p className="ticket-kind">基础信息</p>
          <div className="merchant-metric-list">
            <div>
              <p>骑手姓名</p>
              <strong>{selectedRider.name}</strong>
            </div>
            <div>
              <p>配送工具</p>
              <strong>{selectedRider.vehicle}</strong>
            </div>
            <div>
              <p>当前状态</p>
              <strong>{selectedRider.availability}</strong>
            </div>
          </div>
        </section>
      </aside>

      <div className="merchant-store-content">
        <RiderProfileAccountSection BANK_OPTIONS={BANK_OPTIONS} profileDraft={profileDraft} profileErrors={profileErrors} runAction={runAction} selectedRider={selectedRider} setProfileDraft={setProfileDraft} setProfileErrors={setProfileErrors} updateRiderProfile={updateRiderProfile} />
        <RiderProfileWithdrawSection formatPrice={formatPrice} formatTime={formatTime} runAction={runAction} selectedRider={selectedRider} setWithdrawAmount={setWithdrawAmount} setWithdrawError={setWithdrawError} withdrawAmount={withdrawAmount} withdrawError={withdrawError} withdrawRiderIncome={withdrawRiderIncome} />
      </div>
    </div>
  )
}
