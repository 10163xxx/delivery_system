import type {
  OrderSummary,
  RiderId,
} from '@/objects/core/SharedObjects'
import { ORDER_STATUS, ROLE } from '@/objects/core/SharedObjects'
import type {
  DeliveryPageDerivedState,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'

export function getRiderOrders(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
  selectedRiderId: RiderId | '',
) {
  const activeRiderId =
    session?.user.role === ROLE.rider && session.user.linkedProfileId
      ? session.user.linkedProfileId
      : selectedRiderId

  const isActiveRiderOrder = (order: OrderSummary) =>
    order.riderId === activeRiderId &&
    (order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering)

  const isAvailableOrder = (order: OrderSummary) =>
    order.status === ORDER_STATUS.readyForPickup && !order.riderId

  const isHistoryOrder = (order: OrderSummary) =>
    order.riderId === activeRiderId && order.status === ORDER_STATUS.completed

  return {
    riderOrders: state?.orders.filter(isActiveRiderOrder) ?? [],
    riderAvailableOrders: state?.orders.filter(isAvailableOrder) ?? [],
    riderHistoryOrders: state?.orders.filter(isHistoryOrder) ?? [],
  }
}
