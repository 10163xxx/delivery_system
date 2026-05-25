import type { MerchantStorePanelProps } from '@/pages/merchant/object/MerchantConsoleObjects'
import type { OrderSummary } from '@/shared/object/core/SharedObjects'
import { MerchantOrderActionRow } from '@/pages/merchant/console/orders/MerchantOrderActionSections'
import { MerchantOrderChat } from '@/pages/merchant/console/orders/MerchantOrderChatSection'
import { MerchantRefundResolutionList } from '@/pages/merchant/console/orders/MerchantOrderRefundSections'

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
      <MerchantRefundResolutionList order={order} {...props} />
      <MerchantOrderActionRow order={order} props={props} state={state} />
      <MerchantOrderChat order={order} store={store} {...props} />
    </>
  )
}
