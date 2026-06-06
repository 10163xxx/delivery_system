import {
  AFTER_SALES_REQUEST_TYPE,
  APPLICATION_STATUS,
  TICKET_STATUS,
  type DisplayText,
  type OrderLineItem,
  type OrderId,
  type OrderSummary,
} from '@/objects/core/SharedObjects'
import {
  buildCustomerReviewRoute,
  buildPartialRefundDraftKey,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import {
  DEFAULT_PARTIAL_REFUND_QUANTITY,
  createInitialPartialRefundDraft,
} from '@/features/delivery/DeliveryServices'
import type {
  CustomerOrderHelpersProps,
  PartialRefundActionRowProps,
} from '@/pages/order/objects/OrderPageObjects'
import { clearRecordError, renderOrderChat } from '@/pages/order/CustomerOrderDisplayParts'
import { ORDER_PAGE_COPY } from '@/pages/order/OrderPageCopy'
import { asDomainText } from '@/features/delivery/DeliveryShared'

function PartialRefundActionRow({ order, item, props }: PartialRefundActionRowProps) {
  const {
    partialRefundDrafts,
    partialRefundErrors,
    getRemainingRefundableQuantity,
    setPartialRefundDrafts,
    setPartialRefundErrors,
    submitPartialRefundRequest,
  } = props
  const draftKey = buildPartialRefundDraftKey(order.id, item.menuItemId)
  const draft = partialRefundDrafts[draftKey] ?? createInitialPartialRefundDraft()
  const refundError = partialRefundErrors[draftKey]
  const remainingRefundableQuantity = getRemainingRefundableQuantity(order, item.menuItemId)
  const hasPendingRefund = order.partialRefundRequests.some(
    (refund) =>
      refund.menuItemId === item.menuItemId && refund.status === APPLICATION_STATUS.pending,
  )

  if (remainingRefundableQuantity <= 0 && !hasPendingRefund) {
    return null
  }

  return (
    <div
      key={item.menuItemId}
      className={`ticket-actions refund-request-row${refundError ? ' has-error' : ''}`}
    >
      <span className="meta-line">
        {ORDER_PAGE_COPY.partialRefund.refundableQuantityLabel(item.name, remainingRefundableQuantity)}
      </span>
      <input
        max={Math.max(DEFAULT_PARTIAL_REFUND_QUANTITY, remainingRefundableQuantity)}
        min={DEFAULT_PARTIAL_REFUND_QUANTITY}
        type="number"
        value={draft.quantity}
        onChange={(event) =>
          setPartialRefundDrafts((current) => ({
            ...current,
            [draftKey]: {
              quantity: Number(event.target.value) || DEFAULT_PARTIAL_REFUND_QUANTITY,
              reason: current[draftKey]?.reason ?? asDomainText<DisplayText>(''),
            },
          }))
        }
      />
      <input
        className={refundError ? 'field-error' : undefined}
        placeholder={ORDER_PAGE_COPY.partialRefund.reasonPlaceholder}
        value={draft.reason}
        onChange={(event) => {
          setPartialRefundDrafts((current) => ({
            ...current,
            [draftKey]: {
              quantity: current[draftKey]?.quantity ?? DEFAULT_PARTIAL_REFUND_QUANTITY,
              reason: asDomainText<DisplayText>(event.target.value),
            },
          }))
          clearRecordError(draftKey, setPartialRefundErrors)
        }}
      />
      <button
        className="secondary-button"
        disabled={remainingRefundableQuantity <= 0 || hasPendingRefund}
        onClick={() => void submitPartialRefundRequest(order.id, item.menuItemId)}
        type="button"
      >
        {hasPendingRefund
          ? ORDER_PAGE_COPY.partialRefund.pendingButtonLabel
          : ORDER_PAGE_COPY.partialRefund.submitButtonLabel}
      </button>
      {refundError ? (
        <span className="field-error-text refund-error-text">{refundError}</span>
      ) : null}
    </div>
  )
}

export function renderPartialRefundActions(
  order: OrderSummary,
  props: CustomerOrderHelpersProps,
) {
  if (!props.canSubmitPartialRefund(order)) return null

  return (
    <div className="panel-stack">
      {order.items.map((item: OrderLineItem) => (
        <PartialRefundActionRow key={item.menuItemId} order={order} item={item} props={props} />
      ))}
    </div>
  )
}

export function renderCustomerOrderFooter(
  order: OrderSummary,
  props: CustomerOrderHelpersProps,
) {
  const reviewAction = props.canReviewOrder(order) ? (
    <div className="inline-form">
      <p className="meta-line">
        {ORDER_PAGE_COPY.footer.reviewActionHint(props.getRemainingReviewDays(order))}
      </p>
      <button
        className="secondary-button"
        onClick={() => props.navigate(buildCustomerReviewRoute(order.id))}
        type="button"
      >
        {ORDER_PAGE_COPY.footer.reviewActionButton}
      </button>
    </div>
  ) : null

  return (
    <>
      {renderPartialRefundActions(order, props)}
      {reviewAction}
      {renderOrderChat(order, props)}
    </>
  )
}

export function AfterSalesActionPanel({
  order,
  orderTicket,
  afterSalesDraft,
  afterSalesError,
  setAfterSalesDrafts,
  setAfterSalesErrors,
  submitAfterSalesRequest,
}: {
  order: OrderSummary
  orderTicket: CustomerOrderHelpersProps['stateTickets'][number] | undefined
  afterSalesDraft: CustomerOrderHelpersProps['afterSalesDrafts'][OrderId]
  afterSalesError: DisplayText | undefined
  setAfterSalesDrafts: CustomerOrderHelpersProps['setAfterSalesDrafts']
  setAfterSalesErrors: CustomerOrderHelpersProps['setAfterSalesErrors']
  submitAfterSalesRequest: CustomerOrderHelpersProps['submitAfterSalesRequest']
}) {
  return (
    <div className={`ticket-actions refund-request-row${afterSalesError ? ' has-error' : ''}`}>
      <select
        value={afterSalesDraft.requestType}
        onChange={(event) => {
          const value = event.target.value as typeof afterSalesDraft.requestType
          setAfterSalesDrafts((current) => ({
            ...current,
            [order.id]: {
              ...(current[order.id] ?? afterSalesDraft),
              requestType: value,
            },
          }))
          clearRecordError(order.id, setAfterSalesErrors)
        }}
      >
        <option value={AFTER_SALES_REQUEST_TYPE.returnRequest}>
          {ORDER_PAGE_COPY.afterSales.returnRequestOption}
        </option>
        <option value={AFTER_SALES_REQUEST_TYPE.compensationRequest}>
          {ORDER_PAGE_COPY.afterSales.compensationRequestOption}
        </option>
      </select>
      {afterSalesDraft.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest ? (
        <input
          min="0"
          placeholder={ORDER_PAGE_COPY.afterSales.compensationAmountPlaceholder}
          step="0.01"
          type="number"
          value={afterSalesDraft.expectedCompensationYuan}
          onChange={(event) =>
            setAfterSalesDrafts((current) => ({
              ...current,
              [order.id]: {
                ...(current[order.id] ?? afterSalesDraft),
                expectedCompensationYuan: asDomainText<DisplayText>(event.target.value),
              },
            }))
          }
        />
      ) : null}
      <input
        className={afterSalesError ? 'field-error' : undefined}
        placeholder={
          afterSalesDraft.requestType === AFTER_SALES_REQUEST_TYPE.returnRequest
            ? ORDER_PAGE_COPY.afterSales.returnReasonPlaceholder
            : ORDER_PAGE_COPY.afterSales.compensationReasonPlaceholder
        }
        value={afterSalesDraft.reason}
        onChange={(event) => {
          setAfterSalesDrafts((current) => ({
            ...current,
            [order.id]: {
              ...(current[order.id] ?? afterSalesDraft),
              reason: asDomainText<DisplayText>(event.target.value),
            },
          }))
          clearRecordError(order.id, setAfterSalesErrors)
        }}
      />
      <button
        className="primary-button"
        disabled={orderTicket?.status === TICKET_STATUS.open}
        onClick={() => void submitAfterSalesRequest(order.id)}
        type="button"
      >
        {orderTicket?.status === TICKET_STATUS.open
          ? ORDER_PAGE_COPY.afterSales.existingTicketButton
          : ORDER_PAGE_COPY.afterSales.submitButton}
      </button>
      {afterSalesError ? (
        <span className="field-error-text refund-error-text">{afterSalesError}</span>
      ) : null}
    </div>
  )
}
