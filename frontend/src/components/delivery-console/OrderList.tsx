import type { ReactNode } from 'react'

type OrderSummary = import('@/domain').OrderSummary

type OrderListProps = {
  orders: OrderSummary[]
  emptyText: string
  footer?: (order: OrderSummary) => ReactNode
  formatPrice: (priceCents: number) => string
  formatTime: (value: string) => string
  onOpenOrder?: (orderId: string) => void
  statusLabels: Record<OrderSummary['status'], string>
}

export function OrderList({
  orders,
  emptyText,
  footer,
  formatPrice,
  formatTime,
  onOpenOrder,
  statusLabels,
}: OrderListProps) {
  if (orders.length === 0) {
    return <div className="empty-card">{emptyText}</div>
  }

  return (
    <div className="order-grid">
      {orders
        .slice()
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((order) => {
          const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

          return (
            <article key={order.id} className="order-card">
              <div className="order-card-top">
                <div>
                  <p className="order-id">{order.id}</p>
                  <h3>
                    {order.storeName}
                    {' -> '}
                    {order.customerName}
                  </h3>
                </div>
                <div className="order-card-summary">
                  <span className="badge">{statusLabels[order.status]}</span>
                  <strong>{formatPrice(order.totalPriceCents)}</strong>
                  {onOpenOrder ? (
                    <button
                      className="secondary-button"
                      onClick={() => onOpenOrder(order.id)}
                      type="button"
                    >
                      查看详情
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="order-card-brief">
                <p className="meta-line">
                  下单于 {formatTime(order.createdAt)} · 预约送达 {formatTime(order.scheduledDeliveryAt)}
                </p>
                <p className="meta-line">
                  配送地址 {order.deliveryAddress} · {totalItemCount} 件商品
                </p>
                {order.storeRating !== undefined || order.riderRating !== undefined ? (
                  <p className="meta-line">
                    商家 {order.storeRating ?? '-'} 星 / 骑手 {order.riderRating ?? '-'} 星
                  </p>
                ) : null}
              </div>
              {footer ? <div className="order-card-detail">{footer(order)}</div> : null}
            </article>
          )
        })}
    </div>
  )
}
