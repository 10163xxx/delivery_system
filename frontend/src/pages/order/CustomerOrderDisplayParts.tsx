import type { Dispatch, SetStateAction } from 'react'
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
} from '@/objects/core/SharedObjects'
import type {
  CustomerOrderHelpersProps,
  OrderItemsListProps,
  OrderTimelineProps,
} from '@/objects/order/page/OrderPageObjects'
import { OrderChatPanel } from '@/pages/order/OrderChatPanel'
import { ORDER_PAGE_COPY } from '@/pages/order/OrderPageCopy'

export function isDeliveryIssueTicket(ticket: AdminTicket, orderId: string) {
  return ticket.orderId === orderId && ticket.kind === TICKET_KIND.deliveryIssue
}

export function clearRecordError<K extends string>(
  key: K,
  setErrors: Dispatch<SetStateAction<Record<K, string>>>,
) {
  setErrors((current: Record<K, string>) => {
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
    return ORDER_PAGE_COPY.display.noAfterSalesSummary
  }

  if (orderTicket.status === TICKET_STATUS.open) {
    return `${ORDER_PAGE_COPY.display.afterSalesPendingPrefix}${orderTicket.summary}`
  }

  return `${ORDER_PAGE_COPY.display.afterSalesResolvedSummary(
    orderTicket.approved
      ? ORDER_PAGE_COPY.display.afterSalesApprovedLabel
      : ORDER_PAGE_COPY.display.afterSalesRejectedLabel,
    orderTicket.resolutionNote ?? orderTicket.summary,
  )}${
    orderTicket.issuedCoupon
      ? `${ORDER_PAGE_COPY.display.issuedCouponPrefix}${orderTicket.issuedCoupon.title}`
      : ''
  }${
    orderTicket.actualCompensationCents
      ? `${ORDER_PAGE_COPY.display.compensationPrefix}${formatPrice(orderTicket.actualCompensationCents)}`
      : ''
  }`
}

export function OrderItemsList({ order, formatPrice }: OrderItemsListProps) {
  return (
    <ul className="line-items">
      {order.items.map((item: OrderLineItem) => (
        <li key={item.menuItemId}>
          <span>
            {item.name}
            {ORDER_PAGE_COPY.display.lineItemQuantitySeparator}
            {item.quantity}
            {item.selections.length > 0
              ? `${ORDER_PAGE_COPY.display.lineItemSelectionSeparator}${item.selections
                  .map(
                    (selection) =>
                      `${selection.groupName}${ORDER_PAGE_COPY.display.selectionValueSeparator}${selection.selectedOptions.join(ORDER_PAGE_COPY.display.selectionOptionSeparator)}`,
                  )
                  .join(ORDER_PAGE_COPY.display.selectionGroupSeparator)}`
              : ''}
            {item.refundedQuantity > 0
              ? `${ORDER_PAGE_COPY.display.refundedQuantityPrefix}${item.refundedQuantity}`
              : ''}
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
            {entry.note}
            {ORDER_PAGE_COPY.display.timelineNoteSeparator}
            {formatTime(entry.at)}
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
          <span>{ORDER_PAGE_COPY.display.partialRefundHistoryLabel}</span>
          <p>
            {refund.itemName}
            {ORDER_PAGE_COPY.display.lineItemQuantitySeparator}
            {refund.quantity}
            {ORDER_PAGE_COPY.display.timelineNoteSeparator}
            {refund.status === APPLICATION_STATUS.pending
              ? ORDER_PAGE_COPY.display.partialRefundPendingLabel
              : refund.status === APPLICATION_STATUS.approved
                ? ORDER_PAGE_COPY.display.partialRefundApprovedLabel
                : ORDER_PAGE_COPY.display.partialRefundRejectedLabel}
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
          {ORDER_PAGE_COPY.display.reviewRevokedPrefix}
          {order.reviewRevokedReason
            ? `${ORDER_PAGE_COPY.display.reviewRevokedReasonSeparator}${order.reviewRevokedReason}`
            : ''}
        </p>
      ) : null}
      {order.storeReviewComment ? (
        <p className="meta-line">
          {ORDER_PAGE_COPY.display.storeReviewCommentPrefix}
          {order.storeReviewComment}
        </p>
      ) : null}
      {order.storeReviewExtraNote ? (
        <p className="meta-line">
          {ORDER_PAGE_COPY.display.storeReviewExtraNotePrefix}
          {order.storeReviewExtraNote}
        </p>
      ) : null}
      {order.riderReviewComment ? (
        <p className="meta-line">
          {ORDER_PAGE_COPY.display.riderReviewCommentPrefix}
          {order.riderReviewComment}
        </p>
      ) : null}
      {order.riderReviewExtraNote ? (
        <p className="meta-line">
          {ORDER_PAGE_COPY.display.riderReviewExtraNotePrefix}
          {order.riderReviewExtraNote}
        </p>
      ) : null}
      {order.merchantRejectReason ? (
        <p className="meta-line">
          {ORDER_PAGE_COPY.display.merchantRejectReasonPrefix}
          {order.merchantRejectReason}
        </p>
      ) : null}
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
      currentDisplayName={selectedCustomer?.name ?? ORDER_PAGE_COPY.display.currentCustomerFallback}
      currentRole={ROLE.customer}
      draft={orderChatDrafts[order.id] ?? ''}
      errorText={orderChatErrors[order.id]}
      disabled={false}
      disabledReason={
        order.riderId
          ? undefined
          : ORDER_PAGE_COPY.display.chatDisabledReason
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
