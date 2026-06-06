import type {
  MerchantAppealDraftMap,
  MerchantConsolePanelProps,
  OrderRejectDraftMap,
  StoreReviewReplyDraftMap,
} from '@/pages/merchant/hooks/MerchantConsoleState'
import type { MerchantStorePanelProps } from '@/pages/merchant/objects/MerchantConsoleObjects'
import { MERCHANT_CONSOLE_COPY } from '@/pages/merchant/console/shell/MerchantConsoleCopy'
import {
  MAX_REVIEW_EXTRA_NOTE_LENGTH,
  normalizeWhitespace,
} from '@/features/delivery/DeliveryServices'
import {
  APPEAL_ROLE,
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_STATUS,
  type NoteText,
  type OrderSummary,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'

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

function MerchantReviewReplyAction({
  order,
  props,
}: {
  order: OrderSummary
  props: Pick<
    MerchantConsolePanelProps,
    | 'appendStoreReviewReply'
    | 'runAction'
    | 'setStoreReviewReplyDrafts'
    | 'storeReviewReplyDrafts'
  >
}) {
  const hasSubmittedStoreReview = order.storeRating != null
  const hasMerchantReply = Boolean(order.storeMerchantReply)
  const draft = props.storeReviewReplyDrafts[order.id] ?? asDomainText<NoteText>('')
  const normalizedReply = asDomainText<NoteText>(
    normalizeWhitespace(draft).trim().slice(0, MAX_REVIEW_EXTRA_NOTE_LENGTH),
  )

  if (order.reviewStatus !== REVIEW_STATUS.active || !hasSubmittedStoreReview) return null

  if (hasMerchantReply) {
    return <span className="badge">已追加评论</span>
  }

  return (
    <>
      <input
        maxLength={MAX_REVIEW_EXTRA_NOTE_LENGTH}
        placeholder="商家追加评论"
        value={draft}
        onChange={(event) =>
          props.setStoreReviewReplyDrafts((current: StoreReviewReplyDraftMap) => ({
            ...current,
            [order.id]: asDomainText<NoteText>(event.target.value),
          }))
        }
      />
      <button
        className="secondary-button"
        disabled={!normalizedReply}
        onClick={() =>
          void props.runAction(() =>
            props.appendStoreReviewReply(order.id, { reply: normalizedReply }),
          ).then((success) => {
            if (!success) return
            props.setStoreReviewReplyDrafts((current: StoreReviewReplyDraftMap) => ({
              ...current,
              [order.id]: asDomainText<NoteText>(''),
            }))
          })
        }
        type="button"
      >
        追加评论
      </button>
    </>
  )
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

export function MerchantOrderActionRow({
  order,
  props,
  state,
}: {
  order: OrderSummary
  props: MerchantConsolePanelProps
  state: MerchantStorePanelProps['state']
}) {
  return (
    <div className="action-row">
      <MerchantOrderStatusActions order={order} props={props} />
      <MerchantReviewReplyAction order={order} props={props} />
      <MerchantReviewAppealAction
        buildReviewAppealPayload={props.buildReviewAppealPayload}
        merchantAppealDrafts={props.merchantAppealDrafts}
        order={order}
        runAction={props.runAction}
        setMerchantAppealDrafts={props.setMerchantAppealDrafts}
        state={state}
        submitReviewAppeal={props.submitReviewAppeal}
      />
    </div>
  )
}
