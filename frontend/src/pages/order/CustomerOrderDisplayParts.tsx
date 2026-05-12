import {
  APPLICATION_STATUS,
  REVIEW_STATUS,
  ROLE,
  TICKET_KIND,
  TICKET_STATUS,
  type AdminTicket,
  type OrderLineItem,
  type OrderSummary,
  type OrderTimelineEntry,
} from '@/shared/object/core/SharedObjects'
import type {
  CustomerOrderHelpersProps,
  OrderItemsListProps,
  OrderTimelineProps,
} from '@/pages/order/object/OrderPageObjects'
import { OrderChatPanel } from '@/pages/order/OrderChatPanel'

export function isDeliveryIssueTicket(ticket: AdminTicket, orderId: string) {
  return ticket.orderId === orderId && ticket.kind === TICKET_KIND.deliveryIssue
}

export function clearRecordError(
  key: string,
  setErrors:
    | CustomerOrderHelpersProps['setPartialRefundErrors']
    | CustomerOrderHelpersProps['setAfterSalesErrors']
    | CustomerOrderHelpersProps['setOrderChatErrors'],
) {
  setErrors((current: Record<string, string>) => {
    if (!current[key]) return current
    const next = { ...current }
    delete next[key]
    return next
  })
}

export function getAfterSalesSummary(
  orderTicket: AdminTicket | undefined,
  formatPrice: CustomerOrderHelpersProps['formatPrice'],
) {
  if (!orderTicket) {
    return '当前还没有售后申请，可提交退货或赔偿诉求。'
  }

  if (orderTicket.status === TICKET_STATUS.open) {
    return `售后申请处理中：${orderTicket.summary}`
  }

  return `售后${orderTicket.approved ? '已通过' : '已驳回'}：${
    orderTicket.resolutionNote ?? orderTicket.summary
  }${
    orderTicket.issuedCoupon ? ` · 已补发优惠券 ${orderTicket.issuedCoupon.title}` : ''
  }${
    orderTicket.actualCompensationCents
      ? ` · 处理金额 ${formatPrice(orderTicket.actualCompensationCents)}`
      : ''
  }`
}

export function OrderItemsList({ order, formatPrice }: OrderItemsListProps) {
  return (
    <ul className="line-items">
      {order.items.map((item: OrderLineItem) => (
        <li key={item.menuItemId}>
          <span>
            {item.name} x {item.quantity}
            {item.refundedQuantity > 0 ? ` · 已退 ${item.refundedQuantity}` : ''}
          </span>
          <strong>{formatPrice(item.quantity * item.unitPriceCents)}</strong>
        </li>
      ))}
    </ul>
  )
}

export function OrderTimeline({ order, formatTime, statusLabels }: OrderTimelineProps) {
  return (
    <div className="timeline">
      {order.timeline.map((entry: OrderTimelineEntry) => (
        <div key={`${entry.status}-${entry.at}`} className="timeline-item">
          <span>{statusLabels[entry.status]}</span>
          <p>
            {entry.note} · {formatTime(entry.at)}
          </p>
        </div>
      ))}
    </div>
  )
}

export function PartialRefundHistory({ order }: { order: OrderSummary }) {
  if (order.partialRefundRequests.length === 0) return null

  return (
    <div className="timeline">
      {order.partialRefundRequests.map((refund) => (
        <div key={refund.id} className="timeline-item">
          <span>缺货退款</span>
          <p>
            {refund.itemName} x {refund.quantity} ·
            {refund.status === APPLICATION_STATUS.pending
              ? ' 待商家处理'
              : refund.status === APPLICATION_STATUS.approved
                ? ' 已同意'
                : ' 已拒绝'}
            {refund.resolutionNote ? ` · ${refund.resolutionNote}` : ''}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ReviewNotes({ order }: { order: OrderSummary }) {
  return (
    <>
      {order.reviewStatus === REVIEW_STATUS.revoked ? (
        <p className="meta-line">
          评价已撤销
          {order.reviewRevokedReason ? `：${order.reviewRevokedReason}` : ''}
        </p>
      ) : null}
      {order.storeReviewComment ? <p className="meta-line">商家理由：{order.storeReviewComment}</p> : null}
      {order.storeReviewExtraNote ? <p className="meta-line">商家补充：{order.storeReviewExtraNote}</p> : null}
      {order.riderReviewComment ? <p className="meta-line">骑手理由：{order.riderReviewComment}</p> : null}
      {order.riderReviewExtraNote ? <p className="meta-line">骑手补充：{order.riderReviewExtraNote}</p> : null}
      {order.merchantRejectReason ? <p className="meta-line">拒单理由：{order.merchantRejectReason}</p> : null}
    </>
  )
}

export function renderOrderChat(order: OrderSummary, props: CustomerOrderHelpersProps) {
  const {
    selectedCustomer,
    orderChatDrafts,
    orderChatErrors,
    formatTime,
    setOrderChatDrafts,
    setOrderChatErrors,
    submitOrderChatMessage,
  } = props

  return (
    <OrderChatPanel
      currentDisplayName={selectedCustomer?.name ?? '顾客'}
      currentRole={ROLE.customer}
      draft={orderChatDrafts[order.id] ?? ''}
      errorText={orderChatErrors[order.id]}
      disabled={false}
      disabledReason={
        order.riderId
          ? undefined
          : '骑手尚未接单，当前聊天将先发送给商家；骑手接单后也能看到历史消息。'
      }
      formatTime={formatTime}
      order={order}
      onChangeDraft={(value) => {
        setOrderChatDrafts((current: Record<string, string>) => ({
          ...current,
          [order.id]: value,
        }))
        clearRecordError(order.id, setOrderChatErrors)
      }}
      onSubmit={() => void submitOrderChatMessage(order.id)}
    />
  )
}
