import {
  APPLICATION_STATUS,
  REVIEW_STATUS,
  ROLE,
  type DisplayText,
  type OrderLineItem,
  type OrderSummary,
  type OrderTimelineEntry,
  type PersonName,
} from '@/objects/core/SharedObjects'
import type {
  CustomerOrderHelpersProps,
  OrderItemsListProps,
  OrderTimelineProps,
} from '@/pages/OrderConsole/objects/OrderPageObjects'
import { OrderChatPanel } from '@/pages/OrderConsole/components/OrderChatPanel'
import { ORDER_PAGE_COPY } from '@/pages/OrderConsole/OrderPageCopy'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { clearRecordError } from '@/pages/OrderConsole/functions/CustomerOrderDisplayHelpers'

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

export function CustomerOrderChat({
  order,
  props,
}: {
  order: OrderSummary
  props: CustomerOrderHelpersProps
}) {
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
      currentDisplayName={selectedCustomer?.name ?? asDomainText<PersonName>(ORDER_PAGE_COPY.display.currentCustomerFallback)}
      currentRole={ROLE.customer}
      draft={orderChatDrafts[order.id] ?? asDomainText<DisplayText>('')}
      errorText={orderChatErrors[order.id]}
      disabled={false}
      disabledReason={
        order.riderId
          ? undefined
          : asDomainText<DisplayText>(ORDER_PAGE_COPY.display.chatDisabledReason)
      }
      formatTime={formatTime}
      order={order}
      onChangeDraft={(value) => {
        setOrderChatDrafts((current) => ({
          ...current,
          [order.id]: value,
        }))
        clearRecordError(order.id, setOrderChatErrors)
      }}
      onSubmit={() => void submitOrderChatMessage(order.id)}
    />
  )
}
