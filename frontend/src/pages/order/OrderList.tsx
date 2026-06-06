import type { OrderListProps } from '@/pages/order/objects/OrderPageObjects'
import { ORDER_LIST_COPY } from '@/features/delivery/DeliveryMessages'

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
                    {ORDER_LIST_COPY.storeToCustomerSeparator}
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
                      {ORDER_LIST_COPY.viewDetailButton}
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="order-card-brief">
                <p className="meta-line">
                  {ORDER_LIST_COPY.createdAtPrefix}
                  {formatTime(order.createdAt)}
                  {' · '}
                  {ORDER_LIST_COPY.scheduledDeliveryPrefix}
                  {formatTime(order.scheduledDeliveryAt)}
                </p>
                <p className="meta-line">
                  {ORDER_LIST_COPY.deliveryAddressPrefix}
                  {order.deliveryAddress}
                  {' · '}
                  {totalItemCount}
                  {ORDER_LIST_COPY.totalItemCountSuffix}
                </p>
                {order.storeRating !== undefined || order.riderRating !== undefined ? (
                  <p className="meta-line">
                    {ORDER_LIST_COPY.storeRatingPrefix}
                    {order.storeRating ?? ORDER_LIST_COPY.missingRating}
                    {ORDER_LIST_COPY.starSuffix}
                    {ORDER_LIST_COPY.ratingSeparator}
                    {ORDER_LIST_COPY.riderRatingPrefix}
                    {order.riderRating ?? ORDER_LIST_COPY.missingRating}
                    {ORDER_LIST_COPY.starSuffix}
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
