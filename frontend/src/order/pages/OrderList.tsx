import type { ReactNode } from 'react'

type OrderSummary = import('@/shared/object').OrderSummary

type OrderListProps = {
  orders: OrderSummary[]
  emptyText: string
  footer?: (order: OrderSummary) => ReactNode
  formatPrice: (priceCents: number) => string
  formatTime: (value: string) => string
  getOrderCardClassName?: (order: OrderSummary) => string | undefined
  getOrderStatusBadgeClassName?: (order: OrderSummary) => string | undefined
  headerMeta?: (order: OrderSummary) => ReactNode
  onOpenOrder?: (orderId: string) => void
  statusLabels: Record<OrderSummary['status'], string>
}

export function OrderList({
  orders,
  emptyText,
  footer,
  formatPrice,
  formatTime,
  getOrderCardClassName,
  getOrderStatusBadgeClassName,
  headerMeta,
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
          const orderCardClassName = ['order-card', getOrderCardClassName?.(order)]
            .filter(Boolean)
            .join(' ')
          const orderStatusBadgeClassName = ['badge', getOrderStatusBadgeClassName?.(order)]
            .filter(Boolean)
            .join(' ')
          const orderHeaderMeta = headerMeta?.(order)

          return (
            <article key={order.id} className={orderCardClassName}>
              <div className="order-card-top">
                <div>
                  <p className="order-id">{order.id}</p>
                  {orderHeaderMeta ? (
                    <div className="order-card-header-meta">{orderHeaderMeta}</div>
                  ) : null}
                  <h3>
                    {order.storeName}
                    {' -> '}
                    {order.customerName}
                  </h3>
                </div>
                <div className="order-card-summary">
                  <span className={orderStatusBadgeClassName}>{statusLabels[order.status]}</span>
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
