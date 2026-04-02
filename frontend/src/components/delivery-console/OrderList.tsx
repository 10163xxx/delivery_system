import type { ReactNode } from 'react'
import type { OrderSummary } from '@/domain-types/delivery'

type OrderListProps = {
  orders: OrderSummary[]
  emptyText: string
  footer?: (order: OrderSummary) => ReactNode
  formatPrice: (priceCents: number) => string
  formatTime: (value: string) => string
  statusLabels: Record<OrderSummary['status'], string>
}

export function OrderList({
  orders,
  emptyText,
  footer,
  formatPrice,
  formatTime,
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
        .map((order) => (
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
              <span className="badge">{statusLabels[order.status]}</span>
            </div>
            <p className="meta-line">
              下单于 {formatTime(order.createdAt)} · 预约送达 {formatTime(order.scheduledDeliveryAt)} · 配送地址 {order.deliveryAddress}
            </p>
            <ul className="line-items">
              {order.items.map((item) => (
                <li key={item.menuItemId}>
                  <span>
                    {item.name} x {item.quantity}
                    {item.refundedQuantity > 0 ? ` · 已退 ${item.refundedQuantity}` : ''}
                  </span>
                  <strong>{formatPrice(item.quantity * item.unitPriceCents)}</strong>
                </li>
              ))}
            </ul>
            <div className="timeline">
              <div className="timeline-item">
                <span>费用明细</span>
                <p>
                  餐品 {formatPrice(order.itemSubtotalCents)} + 配送费{' '}
                  {formatPrice(order.deliveryFeeCents)} = {formatPrice(order.totalPriceCents)}
                </p>
              </div>
            </div>
            <div className="timeline">
              {order.timeline.map((entry) => (
                <div key={`${entry.status}-${entry.at}`} className="timeline-item">
                  <span>{statusLabels[entry.status]}</span>
                  <p>
                    {entry.note} · {formatTime(entry.at)}
                  </p>
                </div>
              ))}
            </div>
            {order.partialRefundRequests.length > 0 ? (
              <div className="timeline">
                {order.partialRefundRequests.map((refund) => (
                  <div key={refund.id} className="timeline-item">
                    <span>缺货退款</span>
                    <p>
                      {refund.itemName} x {refund.quantity} ·
                      {refund.status === 'Pending'
                        ? ' 待商家处理'
                        : refund.status === 'Approved'
                          ? ' 已同意'
                          : ' 已拒绝'}
                      {refund.resolutionNote ? ` · ${refund.resolutionNote}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="order-card-bottom">
              <strong>{formatPrice(order.totalPriceCents)}</strong>
              {order.storeRating !== undefined || order.riderRating !== undefined ? (
                <span>
                  商家 {order.storeRating ?? '-'} 星 / 骑手 {order.riderRating ?? '-'} 星
                </span>
              ) : null}
            </div>
            {order.reviewStatus === 'Revoked' ? (
              <p className="meta-line">
                评价已撤销
                {order.reviewRevokedReason ? `：${order.reviewRevokedReason}` : ''}
              </p>
            ) : null}
            {order.storeReviewComment ? (
              <p className="meta-line">商家理由：{order.storeReviewComment}</p>
            ) : null}
            {order.storeReviewExtraNote ? (
              <p className="meta-line">商家补充：{order.storeReviewExtraNote}</p>
            ) : null}
            {order.riderReviewComment ? (
              <p className="meta-line">骑手理由：{order.riderReviewComment}</p>
            ) : null}
            {order.riderReviewExtraNote ? (
              <p className="meta-line">骑手补充：{order.riderReviewExtraNote}</p>
            ) : null}
            {footer ? <div>{footer(order)}</div> : null}
          </article>
        ))}
    </div>
  )
}
