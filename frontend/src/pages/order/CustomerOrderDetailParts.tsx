import { ROUTE_PATH } from '@/objects/core/SharedObjects'
import type {
  CustomerOrderDetailHeaderProps,
  CustomerOrderPriceBreakdownProps,
  CustomerOrderSummaryBarProps,
} from '@/pages/order/objects/OrderPageObjects'

export function CustomerOrderDetailHeader({
  navigate,
  order,
  statusLabels,
}: CustomerOrderDetailHeaderProps) {
  return (
    <div className="panel-header">
      <div>
        <p className="ticket-kind">订单详情</p>
        <h3>{order.storeName}</h3>
        <p className="meta-line">
          订单号 {order.id} · 状态 {statusLabels[order.status]}
        </p>
      </div>
      <button
        className="secondary-button"
        onClick={() => navigate(ROUTE_PATH.customerOrders)}
        type="button"
      >
        返回订单列表
      </button>
    </div>
  )
}

export function CustomerOrderSummaryBar({
  formatPrice,
  formatTime,
  order,
}: CustomerOrderSummaryBarProps) {
  return (
    <div className="summary-bar">
      <div>
        <p>实付金额</p>
        <strong>{formatPrice(order.totalPriceCents)}</strong>
      </div>
      <div>
        <p>下单时间</p>
        <strong>{formatTime(order.createdAt)}</strong>
      </div>
      <div>
        <p>预约送达</p>
        <strong>{formatTime(order.scheduledDeliveryAt)}</strong>
      </div>
    </div>
  )
}

export function CustomerOrderPriceBreakdown({
  formatPrice,
  order,
}: CustomerOrderPriceBreakdownProps) {
  return (
    <div className="timeline">
      <div className="timeline-item">
        <span>费用明细</span>
        <p>
          餐品 {formatPrice(order.itemSubtotalCents)} + 配送费{' '}
          {formatPrice(order.deliveryFeeCents)}
          {order.couponDiscountCents > 0
            ? ` - 优惠券 ${formatPrice(order.couponDiscountCents)}`
            : ''}
          {' = '}
          {formatPrice(order.totalPriceCents)}
        </p>
      </div>
      {order.appliedCoupon ? (
        <div className="timeline-item">
          <span>用券信息</span>
          <p>
            {order.appliedCoupon.title} · 抵扣{' '}
            {formatPrice(order.couponDiscountCents)}
          </p>
        </div>
      ) : null}
    </div>
  )
}
