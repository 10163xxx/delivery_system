import type { RiderRoleProps } from '@/shared/app/role-props'
import { RIDER_CONSOLE_COPY } from '@/pages/rider/object/RiderWorkspaceObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import {
  ELIGIBILITY_REVIEW_TARGET,
  RIDER_AVAILABILITY,
  ROLE,
  type Rider,
} from '@/shared/object/core/SharedObjects'
import { RiderOrdersPanel } from '@/pages/rider/workspace/RiderOrdersPanel'

function RiderSelector({
  role,
  selectedRiderId,
  setSelectedRiderId,
  visibleRiders,
}: {
  role: RiderRoleProps['role']
  selectedRiderId: string
  setSelectedRiderId: RiderRoleProps['setSelectedRiderId']
  visibleRiders: Rider[]
}) {
  return (
    <label className="compact-select">
      <span>骑手</span>
      <select
        value={selectedRiderId}
        disabled={role === ROLE.rider}
        onChange={(event) => setSelectedRiderId(event.target.value)}
      >
        {visibleRiders.map((rider) => (
          <option key={rider.id} value={rider.id}>
            {rider.name} · {rider.vehicle}
          </option>
        ))}
      </select>
    </label>
  )
}

function RiderMetrics({
  selectedRider,
  runAction,
  updateRiderAvailability,
  formatAggregateRating,
  formatPrice,
}: {
  selectedRider: Rider | undefined
  runAction: RiderRoleProps['runAction']
  updateRiderAvailability: RiderRoleProps['updateRiderAvailability']
  formatAggregateRating: RiderRoleProps['formatAggregateRating']
  formatPrice: RiderRoleProps['formatPrice']
}) {
  if (!selectedRider) return null

  const isOnDelivery = selectedRider.availability === RIDER_AVAILABILITY.onDelivery
  const isAcceptingOrders = selectedRider.availability === RIDER_AVAILABILITY.available
  const canStopAccepting = !isOnDelivery && selectedRider.availability !== RIDER_AVAILABILITY.suspended
  const canStartAccepting = !isOnDelivery && selectedRider.availability === RIDER_AVAILABILITY.unavailable

  const availabilityLabel =
    selectedRider.availability === RIDER_AVAILABILITY.available
      ? RIDER_CONSOLE_COPY.consolePanel.availabilityAvailable
      : selectedRider.availability === RIDER_AVAILABILITY.onDelivery
        ? RIDER_CONSOLE_COPY.consolePanel.availabilityOnDelivery
        : selectedRider.availability === RIDER_AVAILABILITY.unavailable
          ? RIDER_CONSOLE_COPY.consolePanel.availabilityUnavailable
          : RIDER_CONSOLE_COPY.consolePanel.availabilitySuspended

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span>骑手评分</span>
        <strong>{formatAggregateRating(selectedRider.averageRating, selectedRider.ratingCount)}</strong>
      </div>
      <div className="metric-card">
        <span>当前状态</span>
        <strong>{availabilityLabel}</strong>
      </div>
      <div className="metric-card">
        <span>累计收入</span>
        <strong>{formatPrice(selectedRider.earningsCents)}</strong>
      </div>
      <div className="metric-card">
        <span>1 星差评数</span>
        <strong>{selectedRider.oneStarRatingCount}</strong>
      </div>
      <div className="metric-card">
        <span>接单开关</span>
        <div className="action-row">
          <button
            className="primary-button"
            disabled={!canStartAccepting}
            onClick={() =>
              void runAction(() =>
                updateRiderAvailability(selectedRider.id, {
                  availability: RIDER_AVAILABILITY.available,
                }),
              )
            }
            type="button"
          >
            {RIDER_CONSOLE_COPY.consolePanel.startAccepting}
          </button>
          <button
            className="secondary-button"
            disabled={!canStopAccepting || !isAcceptingOrders}
            onClick={() =>
              void runAction(() =>
                updateRiderAvailability(selectedRider.id, {
                  availability: RIDER_AVAILABILITY.unavailable,
                }),
              )
            }
            type="button"
          >
            {RIDER_CONSOLE_COPY.consolePanel.stopAccepting}
          </button>
        </div>
        {isOnDelivery ? <p className="meta-line">{RIDER_CONSOLE_COPY.consolePanel.onDeliveryLocked}</p> : null}
      </div>
    </div>
  )
}

function RiderEligibilityReviewBar({
  selectedRider,
  eligibilityReviewDrafts,
  setEligibilityReviewDrafts,
  runAction,
  buildEligibilityReviewPayload,
  submitEligibilityReview,
}: {
  selectedRider: Rider | undefined
  eligibilityReviewDrafts: RiderRoleProps['eligibilityReviewDrafts']
  setEligibilityReviewDrafts: RiderRoleProps['setEligibilityReviewDrafts']
  runAction: RiderRoleProps['runAction']
  buildEligibilityReviewPayload: RiderRoleProps['buildEligibilityReviewPayload']
  submitEligibilityReview: RiderRoleProps['submitEligibilityReview']
}) {
  if (selectedRider?.availability !== RIDER_AVAILABILITY.suspended) return null

  return (
    <div className="ticket-actions">
      <input
        placeholder={RIDER_CONSOLE_COPY.consolePanel.eligibilityPlaceholder}
        value={eligibilityReviewDrafts[selectedRider.id] ?? ''}
        onChange={(event) =>
          setEligibilityReviewDrafts((current: Record<string, string>) => ({
            ...current,
            [selectedRider.id]: event.target.value,
          }))
        }
      />
      <button
        className="primary-button"
        onClick={() =>
          void runAction(() =>
            submitEligibilityReview(
              buildEligibilityReviewPayload(
                ELIGIBILITY_REVIEW_TARGET.rider,
                selectedRider.id,
                eligibilityReviewDrafts[selectedRider.id] ?? '',
              ),
            ),
          )
        }
        type="button"
      >
        {RIDER_CONSOLE_COPY.consolePanel.eligibilityAction}
      </button>
    </div>
  )
}

export function RiderConsoleWorkspace({
  props,
  visibleRiders,
}: {
  props: RiderRoleProps
  visibleRiders: Rider[]
}) {
  const {
    role,
    selectedRiderId,
    setSelectedRiderId,
    selectedRider,
    runAction,
    updateRiderAvailability,
    formatAggregateRating,
    formatPrice,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
    buildEligibilityReviewPayload,
    submitEligibilityReview,
  } = props

  return (
    <Panel
      title={RIDER_CONSOLE_COPY.consolePanel.title}
      description={RIDER_CONSOLE_COPY.consolePanel.description}
    >
      <RiderSelector
        role={role}
        selectedRiderId={selectedRiderId}
        setSelectedRiderId={setSelectedRiderId}
        visibleRiders={visibleRiders}
      />
      <RiderMetrics
        selectedRider={selectedRider}
        runAction={runAction}
        updateRiderAvailability={updateRiderAvailability}
        formatAggregateRating={formatAggregateRating}
        formatPrice={formatPrice}
      />
      <RiderEligibilityReviewBar
        selectedRider={selectedRider}
        eligibilityReviewDrafts={eligibilityReviewDrafts}
        setEligibilityReviewDrafts={setEligibilityReviewDrafts}
        runAction={runAction}
        buildEligibilityReviewPayload={buildEligibilityReviewPayload}
        submitEligibilityReview={submitEligibilityReview}
      />
      <RiderOrdersPanel props={props} />
    </Panel>
  )
}
