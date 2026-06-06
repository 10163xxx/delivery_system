import type { RiderRoleProps } from '@/pages/delivery/app/roleProps'
import { Panel } from '@/components/primitives/LayoutPrimitives'
import { OrderList } from '@/pages/order/OrderList'
import { RIDER_CONSOLE_COPY } from '@/pages/rider/objects/RiderWorkspaceObjects'
import { RIDER_AVAILABILITY, type RiderId } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'

function RiderAcceptanceAvailabilityBar({ props }: { props: RiderRoleProps }) {
  const selectedRider = props.selectedRider
  if (!selectedRider) return null

  const isOnDelivery = selectedRider.availability === RIDER_AVAILABILITY.onDelivery
  const isAcceptingOrders = selectedRider.availability === RIDER_AVAILABILITY.available
  const canStopAccepting = !isOnDelivery && selectedRider.availability !== RIDER_AVAILABILITY.suspended
  const canStartAccepting = !isOnDelivery && selectedRider.availability === RIDER_AVAILABILITY.unavailable

  return (
    <div className="summary-bar">
      <div>
        <p>当前状态</p>
        <strong>{selectedRider.availability}</strong>
      </div>
      <div className="action-row">
        <button
          className="primary-button"
          disabled={!canStartAccepting}
          onClick={() =>
            void props.runAction(() =>
              props.updateRiderAvailability(selectedRider.id, {
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
            void props.runAction(() =>
              props.updateRiderAvailability(selectedRider.id, {
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
  )
}

function RiderAcceptOrderFooter({
  order,
  props,
}: {
  order: RiderRoleProps['riderAvailableOrders'][number]
  props: RiderRoleProps
}) {
  const selectedRiderId = props.selectedRider?.id ?? asDomainText<RiderId>('')
  const canAccept = props.selectedRider?.availability === RIDER_AVAILABILITY.available && Boolean(selectedRiderId)

  return (
    <div className="action-row">
      <button
        className="primary-button"
        disabled={!canAccept}
        onClick={() =>
          void props.runAction(() =>
            props.assignRider(order.id, { riderId: selectedRiderId }),
          )
        }
        type="button"
      >
        抢单
      </button>
      {!canAccept ? (
        <p className="meta-line">{RIDER_CONSOLE_COPY.acceptancePanel.unavailableHint}</p>
      ) : null}
    </div>
  )
}

export function RiderAcceptanceWorkspace({ props }: { props: RiderRoleProps }) {
  return (
    <Panel
      title={RIDER_CONSOLE_COPY.acceptancePanel.title}
      description={RIDER_CONSOLE_COPY.acceptancePanel.description}
    >
      <RiderAcceptanceAvailabilityBar props={props} />
      <OrderList
        orders={props.riderAvailableOrders}
        emptyText={RIDER_CONSOLE_COPY.acceptancePanel.emptyOrders}
        formatPrice={props.formatPrice}
        formatTime={props.formatTime}
        footer={(order) => <RiderAcceptOrderFooter order={order} props={props} />}
        statusLabels={props.statusLabels}
      />
    </Panel>
  )
}
