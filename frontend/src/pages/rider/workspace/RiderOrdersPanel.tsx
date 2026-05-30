import type { RiderRoleProps } from '@/pages/delivery/app/roleProps'
import { RIDER_CONSOLE_COPY } from '@/objects/rider/page/RiderWorkspaceObjects'
import { OrderList } from '@/pages/order/OrderList'
import { RiderOrderFooter } from '@/pages/rider/workspace/RiderOrderSections'

export function RiderOrdersPanel({
  props,
}: {
  props: RiderRoleProps
}) {
  return (
    <OrderList
      orders={props.riderOrders}
      emptyText={RIDER_CONSOLE_COPY.consolePanel.emptyOrders}
      formatPrice={props.formatPrice}
      formatTime={props.formatTime}
      footer={(order) => <RiderOrderFooter order={order} props={props} />}
      statusLabels={props.statusLabels}
    />
  )
}
