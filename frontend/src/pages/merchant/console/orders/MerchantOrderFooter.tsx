import type { MerchantStorePanelProps } from '@/pages/merchant/objects/MerchantConsoleObjects'
import type { OrderSummary } from '@/objects/core/SharedObjects'
import { MerchantOrderActionRow } from '@/pages/merchant/console/orders/MerchantOrderActionSections'
import { MerchantOrderChat } from '@/pages/merchant/console/orders/MerchantOrderChatSection'
import { MerchantRefundResolutionList } from '@/pages/merchant/console/orders/MerchantOrderRefundSections'
import { OrderRoutePanel } from '@/pages/order/OrderRoutePanel'

export function MerchantOrderFooter({
  order,
  props,
  state,
  store,
}: Omit<MerchantStorePanelProps, 'storeOrders'> & {
  order: OrderSummary
}) {
  return (
    <>
      <OrderRoutePanel
        order={order}
        formatTime={props.formatTime}
        storeAddress={store.storeAddress}
        storeCoordinate={store.location}
      />
      <MerchantRefundResolutionList order={order} {...props} />
      <MerchantOrderActionRow order={order} props={props} state={state} />
      <MerchantOrderChat order={order} store={store} {...props} />
    </>
  )
}
