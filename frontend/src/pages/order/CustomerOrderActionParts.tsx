import {
  AFTER_SALES_REQUEST_TYPE,
  APPLICATION_STATUS,
  TICKET_STATUS,
  type OrderLineItem,
  type OrderSummary,
} from '@/shared/object/core/SharedObjects'
import {
  DEFAULT_PARTIAL_REFUND_QUANTITY,
  createInitialPartialRefundDraft,
} from '@/shared/delivery/DeliveryServices'
import type {
  CustomerOrderHelpersProps,
  PartialRefundActionRowProps,
} from '@/pages/order/object/OrderPageObjects'
import { clearRecordError, renderOrderChat } from '@/pages/order/CustomerOrderDisplayParts'

function PartialRefundActionRow({ order, item, props }: PartialRefundActionRowProps) {
  const {
    partialRefundDrafts,
    partialRefundErrors,
    getRemainingRefundableQuantity,
    setPartialRefundDrafts,
    setPartialRefundErrors,
    submitPartialRefundRequest,
  } = props
  const draftKey = `${order.id}-${item.menuItemId}`
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
        {item.name} 可退 {remainingRefundableQuantity} 份
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
              reason: current[draftKey]?.reason ?? '',
            },
          }))
        }
      />
      <input
        className={refundError ? 'field-error' : undefined}
        placeholder="例如：这个菜没货就退掉"
        value={draft.reason}
        onChange={(event) => {
          setPartialRefundDrafts((current) => ({
            ...current,
            [draftKey]: {
              quantity: current[draftKey]?.quantity ?? DEFAULT_PARTIAL_REFUND_QUANTITY,
              reason: event.target.value,
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
        {hasPendingRefund ? '退款申请处理中' : '申请退这件商品'}
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
        该订单仍在评价时限内，还剩 {props.getRemainingReviewDays(order)} 天可评价商家和骑手。
      </p>
      <button
        className="secondary-button"
        onClick={() => props.navigate(`/customer/review/${order.id}`)}
        type="button"
      >
        去评价
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
  afterSalesDraft: CustomerOrderHelpersProps['afterSalesDrafts'][string]
  afterSalesError: string | undefined
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
        <option value={AFTER_SALES_REQUEST_TYPE.returnRequest}>退货申请</option>
        <option value={AFTER_SALES_REQUEST_TYPE.compensationRequest}>赔偿申请</option>
      </select>
      {afterSalesDraft.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest ? (
        <input
          min="0"
          placeholder="期望赔偿金额（元）"
          step="0.01"
          type="number"
          value={afterSalesDraft.expectedCompensationYuan}
          onChange={(event) =>
            setAfterSalesDrafts((current) => ({
              ...current,
              [order.id]: {
                ...(current[order.id] ?? afterSalesDraft),
                expectedCompensationYuan: event.target.value,
              },
            }))
          }
        />
      ) : null}
      <input
        className={afterSalesError ? 'field-error' : undefined}
        placeholder={
          afterSalesDraft.requestType === AFTER_SALES_REQUEST_TYPE.returnRequest
            ? '请描述退货原因，例如商品破损、严重变质'
            : '请描述赔偿原因，例如漏送、错送、超时严重'
        }
        value={afterSalesDraft.reason}
        onChange={(event) => {
          setAfterSalesDrafts((current) => ({
            ...current,
            [order.id]: {
              ...(current[order.id] ?? afterSalesDraft),
              reason: event.target.value,
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
        {orderTicket?.status === TICKET_STATUS.open ? '已有售后处理中' : '提交售后申请'}
      </button>
      {afterSalesError ? (
        <span className="field-error-text refund-error-text">{afterSalesError}</span>
      ) : null}
    </div>
  )
}
