import type {
  MerchantAppealDraftMap,
  MerchantConsolePanelProps,
  OrderChatDraftMap,
  OrderRejectDraftMap,
  PartialRefundResolutionDraftMap,
} from '@/merchant/app/state/MerchantConsoleState'
import type { MerchantStorePanelProps } from '@/merchant/object/console/MerchantConsoleObjects'
import { OrderChatPanel } from '@/pages/order/OrderChatPanel'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import {
  APPEAL_ROLE,
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_STATUS,
  ROLE,
  type OrderSummary,
  type Store,
} from '@/shared/object/core/SharedObjects'

export function getMerchantNewOrderCount(storeOrders: OrderSummary[]) {
  return storeOrders.filter(
    (order) => order.status === ORDER_STATUS.pendingMerchantAcceptance,
  ).length
}

function MerchantRefundResolutionList({
  order,
  partialRefundResolutionDrafts,
  resolvePartialRefundRequest,
  setPartialRefundResolutionDrafts,
}: Pick<
  MerchantConsolePanelProps,
  'partialRefundResolutionDrafts' | 'resolvePartialRefundRequest' | 'setPartialRefundResolutionDrafts'
> & {
  order: OrderSummary
}) {
  if (!order.partialRefundRequests.length) return null

  return (
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
              setPartialRefundResolutionDrafts((current: PartialRefundResolutionDraftMap) => ({
                ...current,
                [refund.id]: event.target.value,
              }))
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
  )
}

function MerchantOrderStatusActions({
  order,
  props,
}: {
  order: OrderSummary
  props: Pick<
    MerchantConsolePanelProps,
    | 'acceptOrder'
    | 'getOrderRejectDraft'
    | 'getOrderRejectError'
    | 'readyOrder'
    | 'runAction'
    | 'setOrderRejectDrafts'
    | 'setOrderRejectErrors'
    | 'submitOrderReject'
  >
}) {
  const {
    acceptOrder,
    getOrderRejectDraft,
    getOrderRejectError,
    readyOrder,
    runAction,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    submitOrderReject,
  } = props

  if (order.status === ORDER_STATUS.pendingMerchantAcceptance) {
    return (
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
    )
  }

  if (order.status === ORDER_STATUS.preparing) {
    return (
      <button
        className="secondary-button"
        onClick={() => void runAction(() => readyOrder(order.id))}
        type="button"
      >
        备餐完成
      </button>
    )
  }

  return null
}

function MerchantReviewAppealAction({
  merchantAppealDrafts,
  buildReviewAppealPayload,
  order,
  runAction,
  setMerchantAppealDrafts,
  state,
  submitReviewAppeal,
}: Pick<
  MerchantConsolePanelProps,
  'buildReviewAppealPayload' | 'merchantAppealDrafts' | 'runAction' | 'setMerchantAppealDrafts' | 'submitReviewAppeal'
> & {
  order: OrderSummary
  state: MerchantStorePanelProps['state']
}) {
  const hasSubmittedStoreReview = order.storeRating != null
  const hasPendingMerchantAppeal = state.reviewAppeals.some(
    (appeal) =>
      appeal.orderId === order.id &&
      appeal.appellantRole === APPEAL_ROLE.merchant &&
      appeal.status === APPLICATION_STATUS.pending,
  )

  if (order.reviewStatus !== REVIEW_STATUS.active || !hasSubmittedStoreReview) return null
  if (hasPendingMerchantAppeal) {
    return <span className="badge warning">{MERCHANT_CONSOLE_COPY.alerts.pendingAppeal}</span>
  }

  return (
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
}

function MerchantOrderActionRow({
  buildReviewAppealPayload,
  merchantAppealDrafts,
  order,
  props,
  runAction,
  setMerchantAppealDrafts,
  state,
  submitReviewAppeal,
}: {
  buildReviewAppealPayload: MerchantConsolePanelProps['buildReviewAppealPayload']
  merchantAppealDrafts: MerchantConsolePanelProps['merchantAppealDrafts']
  order: OrderSummary
  props: MerchantConsolePanelProps
  runAction: MerchantConsolePanelProps['runAction']
  setMerchantAppealDrafts: MerchantConsolePanelProps['setMerchantAppealDrafts']
  state: MerchantStorePanelProps['state']
  submitReviewAppeal: MerchantConsolePanelProps['submitReviewAppeal']
}) {
  return (
    <div className="action-row">
      <MerchantOrderStatusActions order={order} props={props} />
      <MerchantReviewAppealAction
        buildReviewAppealPayload={buildReviewAppealPayload}
        merchantAppealDrafts={merchantAppealDrafts}
        order={order}
        runAction={runAction}
        setMerchantAppealDrafts={setMerchantAppealDrafts}
        state={state}
        submitReviewAppeal={submitReviewAppeal}
      />
    </div>
  )
}

function MerchantOrderChat({
  order,
  orderChatDrafts,
  orderChatErrors,
  setOrderChatDrafts,
  setOrderChatErrors,
  store,
  submitOrderChatMessage,
  formatTime,
}: Pick<
  MerchantConsolePanelProps,
  'formatTime' | 'orderChatDrafts' | 'orderChatErrors' | 'setOrderChatDrafts' | 'setOrderChatErrors' | 'submitOrderChatMessage'
> & {
  order: OrderSummary
  store: Store
}) {
  return (
    <OrderChatPanel
      currentDisplayName={store.merchantName}
      currentRole={ROLE.merchant}
      draft={orderChatDrafts[order.id] ?? ''}
      errorText={orderChatErrors[order.id]}
      disabled={false}
      disabledReason={order.riderId ? undefined : MERCHANT_CONSOLE_COPY.chat.orderChatDisabledReason}
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
  )
}

export function MerchantOrderFooter({
  order,
  props,
  state,
  store,
}: Omit<MerchantStorePanelProps, 'storeOrders'> & {
  order: OrderSummary
}) {
  return (
    <>
      <MerchantRefundResolutionList order={order} {...props} />
      <MerchantOrderActionRow
        buildReviewAppealPayload={props.buildReviewAppealPayload}
        merchantAppealDrafts={props.merchantAppealDrafts}
        order={order}
        props={props}
        runAction={props.runAction}
        setMerchantAppealDrafts={props.setMerchantAppealDrafts}
        state={state}
        submitReviewAppeal={props.submitReviewAppeal}
      />
      <MerchantOrderChat order={order} store={store} {...props} />
    </>
  )
}
