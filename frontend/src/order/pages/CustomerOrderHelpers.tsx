import type { CustomerRoleProps } from '@/shared/AppBuildRoleProps'
import { DEFAULT_PARTIAL_REFUND_QUANTITY } from '@/shared/delivery/DeliveryServices'
import { createInitialAfterSalesDraft, createInitialPartialRefundDraft } from '@/shared/delivery/DeliveryServices'
import { OrderChatPanel } from '@/order/pages/OrderChatPanel'
import {
  APPLICATION_STATUS,
  AFTER_SALES_REQUEST_TYPE,
  REVIEW_STATUS,
  ROLE,
  ROUTE_PATH,
  TICKET_KIND,
  TICKET_STATUS,
  type AdminTicket,
  type OrderLineItem,
  type OrderSummary,
  type OrderTimelineEntry,
} from '@/shared/object/SharedObjects'

type CustomerOrderHelpersProps = CustomerRoleProps

function isDeliveryIssueTicket(ticket: AdminTicket, orderId: string) {
  return ticket.orderId === orderId && ticket.kind === TICKET_KIND.deliveryIssue
}

function renderPartialRefundActions(order: OrderSummary, props: CustomerOrderHelpersProps) {
  const {
    canSubmitPartialRefund,
    partialRefundDrafts,
    partialRefundErrors,
    getRemainingRefundableQuantity,
    setPartialRefundDrafts,
    setPartialRefundErrors,
    submitPartialRefundRequest,
  } = props

  if (!canSubmitPartialRefund(order)) return null

  return (
    <div className="panel-stack">
      {order.items.map((item: OrderLineItem) => {
        const draftKey = `${order.id}-${item.menuItemId}`
        const draft = partialRefundDrafts[draftKey] ?? createInitialPartialRefundDraft()
        const refundError = partialRefundErrors[draftKey]
        const remainingRefundableQuantity = getRemainingRefundableQuantity(order, item.menuItemId)
        const hasPendingRefund = order.partialRefundRequests.some(
          (refund) => refund.menuItemId === item.menuItemId && refund.status === APPLICATION_STATUS.pending,
        )

        if (remainingRefundableQuantity <= 0 && !hasPendingRefund) {
          return null
        }

        return (
          <div key={item.menuItemId} className={`ticket-actions refund-request-row${refundError ? ' has-error' : ''}`}>
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
                setPartialRefundErrors((current: Record<string, string>) => {
                  if (!current[draftKey]) return current
                  const next = { ...current }
                  delete next[draftKey]
                  return next
                })
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
            {refundError ? <span className="field-error-text refund-error-text">{refundError}</span> : null}
          </div>
        )
      })}
    </div>
  )
}

function renderOrderChat(order: OrderSummary, props: CustomerOrderHelpersProps) {
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
        setOrderChatErrors((current: Record<string, string>) => {
          if (!current[order.id]) return current
          const next = { ...current }
          delete next[order.id]
          return next
        })
      }}
      onSubmit={() => void submitOrderChatMessage(order.id)}
    />
  )
}

function renderCustomerOrderFooter(order: OrderSummary, props: CustomerOrderHelpersProps) {
  const { canReviewOrder, getRemainingReviewDays, navigate } = props

  if (canReviewOrder(order)) {
    const remainingDays = getRemainingReviewDays(order)
    return (
      <>
        {renderPartialRefundActions(order, props)}
        <div className="inline-form">
          <p className="meta-line">该订单仍在评价时限内，还剩 {remainingDays} 天可评价商家和骑手。</p>
          <button className="secondary-button" onClick={() => navigate(`/customer/review/${order.id}`)} type="button">
            去评价
          </button>
        </div>
        {renderOrderChat(order, props)}
      </>
    )
  }

  return (
    <>
      {renderPartialRefundActions(order, props)}
      {renderOrderChat(order, props)}
    </>
  )
}

type CustomerOrderDetailSectionProps = {
  order: OrderSummary
  props: CustomerOrderHelpersProps
}

export function CustomerOrderDetailSection({ order, props }: CustomerOrderDetailSectionProps) {
  const {
    stateTickets,
    afterSalesDrafts,
    afterSalesErrors,
    statusLabels,
    navigate,
    formatPrice,
    formatTime,
    setAfterSalesDrafts,
    setAfterSalesErrors,
    submitAfterSalesRequest,
  } = props
  const orderTicket = stateTickets.find((ticket) => isDeliveryIssueTicket(ticket, order.id))
  const afterSalesDraft = afterSalesDrafts[order.id] ?? createInitialAfterSalesDraft()
  const afterSalesError = afterSalesErrors[order.id]

  return (
    <section className="order-section-card">
      <div className="panel-header">
        <div>
          <p className="ticket-kind">订单详情</p>
          <h3>{order.storeName}</h3>
          <p className="meta-line">
            订单号 {order.id} · 状态 {statusLabels[order.status]}
          </p>
        </div>
        <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerOrders)} type="button">
          返回订单列表
        </button>
      </div>
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
      <p className="meta-line">配送地址：{order.deliveryAddress}</p>
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
      <div className="timeline">
        <div className="timeline-item">
          <span>费用明细</span>
          <p>
            餐品 {formatPrice(order.itemSubtotalCents)} + 配送费 {formatPrice(order.deliveryFeeCents)}
            {order.couponDiscountCents > 0 ? ` - 优惠券 ${formatPrice(order.couponDiscountCents)}` : ''}
            {' = '}
            {formatPrice(order.totalPriceCents)}
          </p>
        </div>
        {order.appliedCoupon ? (
          <div className="timeline-item">
            <span>用券信息</span>
            <p>
              {order.appliedCoupon.title} · 抵扣 {formatPrice(order.couponDiscountCents)}
            </p>
          </div>
        ) : null}
      </div>
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
      {order.partialRefundRequests.length > 0 ? (
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
      ) : null}
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
      <div className="timeline">
        <div className="timeline-item">
          <span>售后服务</span>
          <p>
            {orderTicket
              ? orderTicket.status === TICKET_STATUS.open
                ? `售后申请处理中：${orderTicket.summary}`
                : `售后${orderTicket.approved ? '已通过' : '已驳回'}：${
                    orderTicket.resolutionNote ?? orderTicket.summary
                  }${
                    orderTicket.issuedCoupon ? ` · 已补发优惠券 ${orderTicket.issuedCoupon.title}` : ''
                  }${
                    orderTicket.actualCompensationCents
                      ? ` · 处理金额 ${formatPrice(orderTicket.actualCompensationCents)}`
                      : ''
                  }`
              : '当前还没有售后申请，可提交退货或赔偿诉求。'}
          </p>
        </div>
      </div>
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
            setAfterSalesErrors((current: Record<string, string>) => {
              if (!current[order.id]) return current
              const next = { ...current }
              delete next[order.id]
              return next
            })
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
            setAfterSalesErrors((current: Record<string, string>) => {
              if (!current[order.id]) return current
              const next = { ...current }
              delete next[order.id]
              return next
            })
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
        {afterSalesError ? <span className="field-error-text refund-error-text">{afterSalesError}</span> : null}
      </div>
      {renderCustomerOrderFooter(order, props)}
    </section>
  )
}
