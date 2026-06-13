import type { RiderRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { RIDER_CONSOLE_COPY } from '@/pages/RiderConsole/objects/RiderWorkspaceObjects'
import { OrderList } from '@/pages/OrderConsole/components/OrderList'
import { RiderOrderFooter } from '@/pages/RiderConsole/components/workspace/RiderOrderSections'

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
