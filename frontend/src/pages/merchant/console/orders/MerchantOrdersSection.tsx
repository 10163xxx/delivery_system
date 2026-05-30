import type { MerchantStorePanelProps } from '@/objects/merchant/page/MerchantConsoleObjects'
import { OrderList } from '@/pages/order/OrderList'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import {
  getMerchantNewOrderCount,
  MerchantOrderFooter,
} from '@/pages/merchant/console/orders/MerchantOrderSections'
import {
  ORDER_STATUS,
  type OrderSummary,
} from '@/objects/core/SharedObjects'

export function MerchantOrdersSection({
  state,
  store,
  storeOrders,
  props,
}: MerchantStorePanelProps) {
  const newOrderCount = getMerchantNewOrderCount(storeOrders)

  return (
    <section className="merchant-section-card">
      <div className="ticket-header merchant-orders-header">
        <div>
          <p className="ticket-kind">订单管理</p>
          <h3>当前店铺订单</h3>
        </div>
        <span className={newOrderCount > 0 ? 'badge urgent' : 'badge'}>
          {newOrderCount > 0 ? `${newOrderCount} 笔新订单` : `${storeOrders.length} 笔`}
        </span>
      </div>
      <OrderList
        orders={storeOrders}
        emptyText={MERCHANT_CONSOLE_COPY.panel.orderEmpty}
        formatPrice={props.formatPrice}
        formatTime={props.formatTime}
        getOrderCardClassName={(order: OrderSummary) =>
          order.status === ORDER_STATUS.pendingMerchantAcceptance ? 'has-new-order' : undefined
        }
        getOrderStatusBadgeClassName={(order: OrderSummary) =>
          order.status === ORDER_STATUS.pendingMerchantAcceptance ? 'urgent' : undefined
        }
        headerMeta={(order: OrderSummary) =>
          order.status === ORDER_STATUS.pendingMerchantAcceptance ? (
            <span className="merchant-new-order-label">{MERCHANT_CONSOLE_COPY.alerts.newOrderBadge}</span>
          ) : null
        }
        footer={(order: OrderSummary) => <MerchantOrderFooter order={order} props={props} state={state} store={store} />}
        statusLabels={props.statusLabels}
      />
    </section>
  )
}
