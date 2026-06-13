import type {
  MerchantConsolePanelProps,
  OrderChatDraftMap,
} from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import { OrderChatPanel } from '@/pages/OrderConsole/components/OrderChatPanel'
import { MERCHANT_CONSOLE_COPY } from '@/pages/MerchantConsole/components/console/shell/MerchantConsoleCopy'
import { ROLE, type DisplayText, type OrderId, type OrderSummary, type Store } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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
      draft={orderChatDrafts[order.id] ?? asDomainText<DisplayText>('')}
      errorText={orderChatErrors[order.id]}
      disabled={false}
      disabledReason={order.riderId ? undefined : asDomainText<DisplayText>(MERCHANT_CONSOLE_COPY.chat.orderChatDisabledReason)}
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
