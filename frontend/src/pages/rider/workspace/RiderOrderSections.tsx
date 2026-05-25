import type { RiderRoleProps } from '@/shared/app/role-props'
import { RIDER_CONSOLE_COPY } from '@/pages/rider/object/RiderWorkspaceObjects'
import { OrderChatPanel } from '@/pages/order/OrderChatPanel'
import {
  APPEAL_ROLE,
  APPEAL_STATUS,
  ORDER_STATUS,
  REVIEW_STATUS,
  ROLE,
  type DisplayText,
  type OrderId,
} from '@/shared/object/core/SharedObjects'

function RiderOrderActionButtons({ order, props }: { order: RiderRoleProps['riderOrders'][number], props: RiderRoleProps }) {
  const { assignRider, deliverOrder, pickupOrder, runAction, selectedRiderId } = props

  return (
    <>
      {order.status === ORDER_STATUS.readyForPickup && !order.riderId ? (
        <button className="primary-button" onClick={() => void runAction(() => assignRider(order.id, { riderId: selectedRiderId }))} type="button">
          抢单
        </button>
      ) : null}
      {order.status === ORDER_STATUS.readyForPickup && order.riderId === selectedRiderId ? (
        <button className="secondary-button" onClick={() => void runAction(() => pickupOrder(order.id))} type="button">
          已取餐
        </button>
      ) : null}
      {order.status === ORDER_STATUS.delivering && order.riderId === selectedRiderId ? (
        <button className="primary-button" onClick={() => void runAction(() => deliverOrder(order.id))} type="button">
          确认送达
        </button>
      ) : null}
    </>
  )
}

function RiderReviewAppealAction({ order, props }: { order: RiderRoleProps['riderOrders'][number], props: RiderRoleProps }) {
  const {
    buildReviewAppealPayload,
    riderAppealDrafts,
    runAction,
    selectedRiderId,
    setRiderAppealDrafts,
    state,
    submitReviewAppeal,
  } = props
  const hasSubmittedRiderReview = order.riderRating != null
  const hasPendingRiderAppeal =
    state?.reviewAppeals.some(
      (appeal) =>
        appeal.orderId === order.id &&
        appeal.appellantRole === APPEAL_ROLE.rider &&
        appeal.status === APPEAL_STATUS.pending,
    ) ?? false

  if (order.reviewStatus !== REVIEW_STATUS.active || order.riderId !== selectedRiderId || !hasSubmittedRiderReview) {
    return null
  }
  if (hasPendingRiderAppeal) {
    return <span className="badge warning">{RIDER_CONSOLE_COPY.consolePanel.appealPending}</span>
  }

  return (
    <>
      <input
        placeholder={RIDER_CONSOLE_COPY.consolePanel.appealPlaceholder}
        value={riderAppealDrafts[order.id] ?? ''}
        onChange={(event) =>
          setRiderAppealDrafts((current: Record<OrderId, DisplayText>) => ({
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
}

export function RiderOrderFooter({ order, props }: { order: RiderRoleProps['riderOrders'][number], props: RiderRoleProps }) {
  return (
    <>
      <div className="action-row">
        <RiderOrderActionButtons order={order} props={props} />
        <RiderReviewAppealAction order={order} props={props} />
      </div>
      <OrderChatPanel
        currentDisplayName={props.currentDisplayName}
        currentRole={ROLE.rider}
        draft={props.orderChatDrafts[order.id] ?? ''}
        errorText={props.orderChatErrors[order.id]}
        disabled={order.riderId !== props.selectedRiderId}
        disabledReason={order.riderId === props.selectedRiderId ? undefined : RIDER_CONSOLE_COPY.consolePanel.chatDisabledReason}
        formatTime={props.formatTime}
        order={order}
        onChangeDraft={(value) => {
          props.setOrderChatDrafts((current: Record<OrderId, DisplayText>) => ({ ...current, [order.id]: value }))
          props.setOrderChatErrors((current: Record<OrderId, DisplayText>) => {
            if (!current[order.id]) return current
            const next = { ...current }
            delete next[order.id]
            return next
          })
        }}
        onSubmit={() => void props.submitOrderChatMessage(order.id)}
      />
    </>
  )
}
