import type {
  MerchantConsolePanelProps,
  OrderChatDraftMap,
} from '@/pages/merchant/hooks/MerchantConsoleState'
import { OrderChatPanel } from '@/pages/order/OrderChatPanel'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import { ROLE, type DisplayText, type OrderId, type OrderSummary, type Store } from '@/objects/core/SharedObjects'

export function MerchantOrderChat({
  order,
  orderChatDrafts,
  orderChatErrors,
  setOrderChatDrafts,
  setOrderChatErrors,
  store,
  submitOrderChatMessage,
  formatTime,
}: Pick<
  MerchantConsolePanelProps,
  'formatTime' | 'orderChatDrafts' | 'orderChatErrors' | 'setOrderChatDrafts' | 'setOrderChatErrors' | 'submitOrderChatMessage'
> & {
  order: OrderSummary
  store: Store
}) {
  return (
    <OrderChatPanel
      currentDisplayName={store.merchantName}
      currentRole={ROLE.merchant}
      draft={orderChatDrafts[order.id] ?? ''}
      errorText={orderChatErrors[order.id]}
      disabled={false}
      disabledReason={order.riderId ? undefined : MERCHANT_CONSOLE_COPY.chat.orderChatDisabledReason}
      formatTime={formatTime}
      order={order}
      onChangeDraft={(value) => {
        setOrderChatDrafts((current: OrderChatDraftMap) => ({
          ...current,
          [order.id]: value,
        }))
        setOrderChatErrors((current: Record<OrderId, DisplayText>) => {
          if (!current[order.id]) return current
          const next = { ...current }
          delete next[order.id]
          return next
        })
      }}
      onSubmit={() => void submitOrderChatMessage(order.id)}
    />
  )
}
