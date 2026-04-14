import type { RiderRoleProps } from '@/shared/app-build-role-props'
import { RIDER_CONSOLE_COPY } from '@/rider/app/rider-support'
import { OrderChatPanel } from '@/order/pages/OrderChatPanel'
import { OrderList } from '@/order/pages/OrderList'
import { Panel } from '@/shared/components/LayoutPrimitives'
import {
  ACCOUNT_STATUS,
  APPEAL_ROLE,
  APPEAL_STATUS,
  ELIGIBILITY_REVIEW_TARGET,
  ORDER_STATUS,
  REVIEW_STATUS,
  ROLE,
  type Rider,
} from '@/shared/object'

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
  formatAggregateRating,
  formatPrice,
}: {
  selectedRider: Rider | undefined
  formatAggregateRating: RiderRoleProps['formatAggregateRating']
  formatPrice: RiderRoleProps['formatPrice']
}) {
  if (!selectedRider) return null

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span>骑手评分</span>
        <strong>{formatAggregateRating(selectedRider.averageRating, selectedRider.ratingCount)}</strong>
      </div>
      <div className="metric-card">
        <span>当前状态</span>
        <strong>{selectedRider.availability}</strong>
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
  if (selectedRider?.availability !== ACCOUNT_STATUS.suspended) return null

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

function RiderOrdersPanel({
  props,
}: {
  props: RiderRoleProps
}) {
  const {
    riderOrders,
    formatPrice,
    formatTime,
    state,
    selectedRiderId,
    currentDisplayName,
    orderChatDrafts,
    orderChatErrors,
    setOrderChatDrafts,
    setOrderChatErrors,
    runAction,
    assignRider,
    pickupOrder,
    deliverOrder,
    riderAppealDrafts,
    setRiderAppealDrafts,
    buildReviewAppealPayload,
    submitReviewAppeal,
    statusLabels,
    submitOrderChatMessage,
  } = props

  return (
    <OrderList
      orders={riderOrders}
      emptyText={RIDER_CONSOLE_COPY.consolePanel.emptyOrders}
      formatPrice={formatPrice}
      formatTime={formatTime}
      footer={(order) => {
        const hasSubmittedRiderReview = order.riderRating != null
        const hasPendingRiderAppeal =
          state?.reviewAppeals.some(
            (appeal) =>
              appeal.orderId === order.id &&
              appeal.appellantRole === APPEAL_ROLE.rider &&
              appeal.status === APPEAL_STATUS.pending,
          ) ?? false

        return (
          <>
            <div className="action-row">
              {order.status === ORDER_STATUS.readyForPickup && !order.riderId ? (
                <button
                  className="primary-button"
                  onClick={() => void runAction(() => assignRider(order.id, { riderId: selectedRiderId }))}
                  type="button"
                >
                  抢单
                </button>
              ) : null}
              {order.status === ORDER_STATUS.readyForPickup && order.riderId === selectedRiderId ? (
                <button
                  className="secondary-button"
                  onClick={() => void runAction(() => pickupOrder(order.id))}
                  type="button"
                >
                  已取餐
                </button>
              ) : null}
              {order.status === ORDER_STATUS.delivering && order.riderId === selectedRiderId ? (
                <button
                  className="primary-button"
                  onClick={() => void runAction(() => deliverOrder(order.id))}
                  type="button"
                >
                  确认送达
                </button>
              ) : null}
              {order.reviewStatus === REVIEW_STATUS.active && order.riderId === selectedRiderId && hasSubmittedRiderReview ? (
                hasPendingRiderAppeal ? (
                  <span className="badge warning">{RIDER_CONSOLE_COPY.consolePanel.appealPending}</span>
                ) : (
                  <>
                    <input
                      placeholder={RIDER_CONSOLE_COPY.consolePanel.appealPlaceholder}
                      value={riderAppealDrafts[order.id] ?? ''}
                      onChange={(event) =>
                        setRiderAppealDrafts((current: Record<string, string>) => ({
                          ...current,
                          [order.id]: event.target.value,
                        }))
                      }
                    />
                    <button
                      className="secondary-button"
                      onClick={() =>
                        void runAction(() =>
                          submitReviewAppeal(
                            order.id,
                            buildReviewAppealPayload(APPEAL_ROLE.rider, riderAppealDrafts[order.id] ?? ''),
                          ),
                        )
                      }
                      type="button"
                    >
                      提交申诉
                    </button>
                  </>
                )
              ) : null}
            </div>
            <OrderChatPanel
              currentDisplayName={currentDisplayName}
              currentRole={ROLE.rider}
              draft={orderChatDrafts[order.id] ?? ''}
              errorText={orderChatErrors[order.id]}
              disabled={order.riderId !== selectedRiderId}
              disabledReason={
                order.riderId === selectedRiderId
                  ? undefined
                  : RIDER_CONSOLE_COPY.consolePanel.chatDisabledReason
              }
              formatTime={formatTime}
              order={order}
              onChangeDraft={(value) => {
                setOrderChatDrafts((current: Record<string, string>) => ({
                  ...current,
                  [order.id]: value,
                }))
                setOrderChatErrors((current: Record<string, string>) => {
                  if (!current[order.id]) return current
                  const next = { ...current }
                  delete next[order.id]
                  return next
                })
              }}
              onSubmit={() => void submitOrderChatMessage(order.id)}
            />
          </>
        )
      }}
      statusLabels={statusLabels}
    />
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
    runAction,
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
