import type {
  MerchantAppealDraftMap,
  MerchantConsolePanelProps,
  OrderChatDraftMap,
  OrderRejectDraftMap,
  PartialRefundResolutionDraftMap,
} from '@/merchant/app/MerchantConsoleState'
import { OrderChatPanel } from '@/order/pages/OrderChatPanel'
import { OrderList } from '@/order/pages/OrderList'
import { MERCHANT_CONSOLE_COPY } from '@/merchant/pages/console/MerchantConsoleCopy'
import {
  APPEAL_ROLE,
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_STATUS,
  ROLE,
  type OrderSummary,
  type Store,
} from '@/shared/object/SharedObjects'

export function MerchantOrdersSection({
  state,
  store,
  storeOrders,
  props,
}: {
  state: NonNullable<MerchantConsolePanelProps['state']>
  store: Store
  storeOrders: OrderSummary[]
  props: MerchantConsolePanelProps
}) {
  const {
    partialRefundResolutionDrafts,
    setPartialRefundResolutionDrafts,
    resolvePartialRefundRequest,
    getOrderRejectDraft,
    getOrderRejectError,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    submitOrderReject,
    runAction,
    acceptOrder,
    readyOrder,
    merchantAppealDrafts,
    setMerchantAppealDrafts,
    buildReviewAppealPayload,
    submitReviewAppeal,
    orderChatDrafts,
    orderChatErrors,
    setOrderChatDrafts,
    setOrderChatErrors,
    submitOrderChatMessage,
    formatTime,
    formatPrice,
    statusLabels,
  } = props
  const newOrderCount = storeOrders.filter(
    (order) => order.status === ORDER_STATUS.pendingMerchantAcceptance,
  ).length

  return (
    <section className="merchant-section-card">
      <div className="ticket-header merchant-orders-header">
        <div>
          <p className="ticket-kind">订单管理</p>
          <h3>当前店铺订单</h3>
        </div>
        <span className={newOrderCount > 0 ? 'badge urgent' : 'badge'}>
          {newOrderCount > 0 ? `${newOrderCount} 笔新订单` : `${storeOrders.length} 笔`}
        </span>
      </div>
      {newOrderCount > 0 ? (
        <div className="merchant-orders-alert" role="status">
          <strong>{MERCHANT_CONSOLE_COPY.newOrderAlertTitle}</strong>
          <span>{MERCHANT_CONSOLE_COPY.newOrderAlertBody}</span>
        </div>
      ) : null}
      <OrderList
        orders={storeOrders}
        emptyText={MERCHANT_CONSOLE_COPY.orderEmpty}
        formatPrice={formatPrice}
        formatTime={formatTime}
        getOrderCardClassName={(order: OrderSummary) =>
          order.status === ORDER_STATUS.pendingMerchantAcceptance ? 'has-new-order' : undefined
        }
        getOrderStatusBadgeClassName={(order: OrderSummary) =>
          order.status === ORDER_STATUS.pendingMerchantAcceptance ? 'urgent' : undefined
        }
        headerMeta={(order: OrderSummary) =>
          order.status === ORDER_STATUS.pendingMerchantAcceptance ? (
            <span className="merchant-new-order-label">{MERCHANT_CONSOLE_COPY.newOrderBadge}</span>
          ) : null
        }
        footer={(order: OrderSummary) => {
          const hasSubmittedStoreReview = order.storeRating != null
          const hasPendingMerchantAppeal = state.reviewAppeals.some(
            (appeal) =>
              appeal.orderId === order.id &&
              appeal.appellantRole === APPEAL_ROLE.merchant &&
              appeal.status === APPLICATION_STATUS.pending,
          )

          return (
            <>
              {order.partialRefundRequests.length > 0 ? (
                <div className="panel-stack">
                  {order.partialRefundRequests.map((refund) => (
                    <div key={refund.id} className="ticket-actions">
                      <span className="meta-line">
                        缺货退款 · {refund.itemName} x {refund.quantity} ·
                        {refund.status === APPLICATION_STATUS.pending
                          ? ' 待处理'
                          : refund.status === APPLICATION_STATUS.approved
                            ? ' 已同意'
                            : ' 已拒绝'}
                      </span>
                      <input
                        disabled={refund.status !== APPLICATION_STATUS.pending}
                        placeholder="处理说明"
                        value={partialRefundResolutionDrafts[refund.id] ?? ''}
                        onChange={(event) =>
                          setPartialRefundResolutionDrafts(
                            (current: PartialRefundResolutionDraftMap) => ({
                              ...current,
                              [refund.id]: event.target.value,
                            }),
                          )
                        }
                      />
                      {refund.status === APPLICATION_STATUS.pending ? (
                        <>
                          <button
                            className="primary-button"
                            onClick={() => void resolvePartialRefundRequest(refund.id, true)}
                            type="button"
                          >
                            同意退款
                          </button>
                          <button
                            className="secondary-button"
                            onClick={() => void resolvePartialRefundRequest(refund.id, false)}
                            type="button"
                          >
                            拒绝退款
                          </button>
                        </>
                      ) : (
                        <span className="badge">{refund.resolutionNote ?? '已处理'}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="action-row">
                {order.status === ORDER_STATUS.pendingMerchantAcceptance ? (
                  <>
                    <button
                      className="primary-button"
                      onClick={() => void runAction(() => acceptOrder(order.id))}
                      type="button"
                    >
                      接单
                    </button>
                    <input
                      className={getOrderRejectError(order.id) ? 'field-error' : undefined}
                      maxLength={160}
                      placeholder="拒单理由（必填）"
                      value={getOrderRejectDraft(order.id)}
                      onChange={(event) => {
                        const value = event.target.value
                        setOrderRejectDrafts((current: OrderRejectDraftMap) => ({
                          ...current,
                          [order.id]: value,
                        }))
                        if (value.trim()) {
                          setOrderRejectErrors((current) => {
                            if (!current[order.id]) return current
                            const next = { ...current }
                            delete next[order.id]
                            return next
                          })
                        }
                      }}
                    />
                    <button
                      className="secondary-button"
                      onClick={() => void submitOrderReject(order.id)}
                      type="button"
                    >
                      拒绝接单
                    </button>
                    {getOrderRejectError(order.id) ? (
                      <small className="field-error-text">{getOrderRejectError(order.id)}</small>
                    ) : null}
                  </>
                ) : null}

                {order.status === ORDER_STATUS.preparing ? (
                  <button
                    className="secondary-button"
                    onClick={() => void runAction(() => readyOrder(order.id))}
                    type="button"
                  >
                    备餐完成
                  </button>
                ) : null}

                {order.reviewStatus === REVIEW_STATUS.active && hasSubmittedStoreReview ? (
                  hasPendingMerchantAppeal ? (
                    <span className="badge warning">{MERCHANT_CONSOLE_COPY.pendingAppeal}</span>
                  ) : (
                    <>
                      <input
                        placeholder="商家申诉理由"
                        value={merchantAppealDrafts[order.id] ?? ''}
                        onChange={(event) =>
                          setMerchantAppealDrafts((current: MerchantAppealDraftMap) => ({
                            ...current,
                            [order.id]: event.target.value,
                          }))
                        }
                      />
                      <button
                        className="secondary-button"
                        onClick={() =>
                          void runAction(() =>
                            submitReviewAppeal(
                              order.id,
                              buildReviewAppealPayload(
                                APPEAL_ROLE.merchant,
                                merchantAppealDrafts[order.id] ?? '',
                              ),
                            ),
                          )
                        }
                        type="button"
                      >
                        提交申诉
                      </button>
                    </>
                  )
                ) : null}
              </div>

              <OrderChatPanel
                currentDisplayName={store.merchantName}
                currentRole={ROLE.merchant}
                draft={orderChatDrafts[order.id] ?? ''}
                errorText={orderChatErrors[order.id]}
                disabled={false}
                disabledReason={
                  order.riderId ? undefined : MERCHANT_CONSOLE_COPY.orderChatDisabledReason
                }
                formatTime={formatTime}
                order={order}
                onChangeDraft={(value) => {
                  setOrderChatDrafts((current: OrderChatDraftMap) => ({
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
            </>
          )
        }}
        statusLabels={statusLabels}
      />
    </section>
  )
}
