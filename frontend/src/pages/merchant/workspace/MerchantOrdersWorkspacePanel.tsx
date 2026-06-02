import { Panel } from '@/components/primitives/LayoutPrimitives'
import type { MerchantConsolePanelProps } from '@/pages/merchant/hooks/MerchantConsoleState'
import { MerchantDeliveryRoutePanel } from '@/pages/merchant/workspace/MerchantDeliveryRoutePanel'
import { MerchantOrderFooter } from '@/pages/merchant/console/orders/MerchantOrderFooter'
import { OrderList } from '@/pages/order/OrderList'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import { ORDER_STATUS, type OrderSummary, type Store } from '@/objects/core/SharedObjects'

function getMerchantOrderStore(merchantStores: Store[], order: OrderSummary) {
  return merchantStores.find((store) => store.id === order.storeId)
}

export function MerchantOrdersWorkspacePanel(props: MerchantConsolePanelProps) {
  const { merchantStores, state } = props

  if (!state) return <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.orderEmpty}</div>

  const storeIdSet = new Set(merchantStores.map((store) => store.id))
  const orders = state.orders.filter((order) => storeIdSet.has(order.storeId))
  const newOrderCount = orders.filter((order) => order.status === ORDER_STATUS.pendingMerchantAcceptance).length

  return (
    <Panel title="订单页" description="查看所有店铺订单和配送处理状态。">
      {merchantStores.length > 0 ? (
        <div className="merchant-store-list">
          <MerchantDeliveryRoutePanel {...props} />
          <div className="summary-bar">
            <div>
              <p>订单概览</p>
              <strong>{orders.length} 笔订单</strong>
            </div>
            <div className="action-row">
              <span className={newOrderCount > 0 ? 'badge urgent' : 'badge'}>
                {newOrderCount > 0 ? `${newOrderCount} 笔新订单` : '暂无新订单'}
              </span>
            </div>
          </div>
          <OrderList
            orders={orders}
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
            footer={(order: OrderSummary) => {
              const store = getMerchantOrderStore(merchantStores, order)
              if (!store) return null
              return <MerchantOrderFooter order={order} props={props} state={state} store={store} />
            }}
            statusLabels={props.statusLabels}
          />
        </div>
      ) : (
        <div className="empty-card">{MERCHANT_CONSOLE_COPY.panel.storeEmpty}</div>
      )}
    </Panel>
  )
}
