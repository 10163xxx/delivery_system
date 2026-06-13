import type { RiderRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { RIDER_CONSOLE_COPY } from '@/pages/RiderConsole/objects/RiderWorkspaceObjects'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { RiderDeliveryRoutePanel } from '@/pages/RiderConsole/components/workspace/RiderDeliveryRoutePanel'
import { ELIGIBILITY_REVIEW_TARGET, RIDER_AVAILABILITY, ROLE, type DisplayText, type Rider, type RiderId } from '@/objects/core/SharedObjects'
import { RiderOrdersPanel } from '@/pages/RiderConsole/components/workspace/RiderOrdersPanel'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

function RiderSelector({
  role,
  selectedRiderId,
  setSelectedRiderId,
  visibleRiders,
}: {
  role: RiderRoleProps['role']
  selectedRiderId: RiderRoleProps['selectedRiderId']
  setSelectedRiderId: RiderRoleProps['setSelectedRiderId']
  visibleRiders: Rider[]
}) {
  return (
    <label className="compact-select">
      <span>骑手</span>
      <select
        value={selectedRiderId}
        disabled={role === ROLE.rider}
        onChange={(event) => setSelectedRiderId(asDomainText<RiderId>(event.target.value))}
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
  formatAggregateRating,
  formatPrice,
}: {
  selectedRider: Rider | undefined
  formatAggregateRating: RiderRoleProps['formatAggregateRating']
  formatPrice: RiderRoleProps['formatPrice']
}) {
  if (!selectedRider) return null

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
        value={eligibilityReviewDrafts[selectedRider.id] ?? asDomainText<DisplayText>('')}
        onChange={(event) =>
          setEligibilityReviewDrafts((current) => ({
            ...current,
            [selectedRider.id]: asDomainText<DisplayText>(event.target.value),
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
                eligibilityReviewDrafts[selectedRider.id] ?? asDomainText<DisplayText>(''),
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
        formatAggregateRating={formatAggregateRating}
        formatPrice={formatPrice}
      />
      <RiderDeliveryRoutePanel {...props} />
      <RiderEligibilityReviewBar
        selectedRider={selectedRider}
        eligibilityReviewDrafts={eligibilityReviewDrafts}
        setEligibilityReviewDrafts={setEligibilityReviewDrafts}
        runAction={props.runAction}
        buildEligibilityReviewPayload={buildEligibilityReviewPayload}
        submitEligibilityReview={submitEligibilityReview}
      />
      <RiderOrdersPanel props={props} />
    </Panel>
  )
}
