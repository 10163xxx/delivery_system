import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type {
  AdminTicket,
  ApprovalFlag,
  DisplayText,
  ResolutionText,
  TicketId,
} from '@/objects/core/SharedObjects'
import {
  AFTER_SALES_REQUEST_TYPE,
  AFTER_SALES_RESOLUTION_MODE,
  TICKET_STATUS,
} from '@/objects/core/SharedObjects'
import type { AfterSalesResolutionDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { formatPrice } from '@/pages/DeliveryConsole/functions/shared/DeliveryFormatters'
import { asDomainBoolean, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  AFTER_SALES_DEFAULTS,
  createInitialAfterSalesDraft,
  getAfterSalesResolutionMode,
  updateAfterSalesResolutionDraft,
} from '@/pages/AdminConsole/components/afterSales/AdminAfterSalesCopy'

export function AdminAfterSalesTicketHeader({
  formatTime,
  ticket,
}: {
  formatTime: AdminRoleProps['formatTime']
  ticket: AdminTicket
}) {
  const isCompensation = ticket.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest

  return (
    <>
      <div className="afterSales-ticket-main">
        <p className="ticket-kind">{ticket.requestType === AFTER_SALES_REQUEST_TYPE.returnRequest ? '退货售后' : '赔偿售后'}</p>
        <h3>订单 {ticket.orderId}</h3>
        <span className={ticket.status === TICKET_STATUS.open ? 'badge warning' : 'badge success'}>
          {ticket.status === TICKET_STATUS.open ? '待审核' : ticket.approved ? '已通过' : '已驳回'}
        </span>
      </div>
      <div className="afterSales-ticket-detail">
        <p>{ticket.summary}</p>
        <p className="meta-line">
          {ticket.submittedByName ? `申请人 ${ticket.submittedByName} · ` : ''}
          提交于 {formatTime(ticket.submittedAt)}
        </p>
        {isCompensation && ticket.expectedCompensationCents ? <p className="meta-line">期望赔偿 {formatPrice(ticket.expectedCompensationCents)}</p> : null}
      </div>
    </>
  )
}

export function AdminAfterSalesOpenActions({
  draft,
  props,
  ticket,
}: {
  draft: AfterSalesResolutionDraft | undefined
  props: Pick<
    AdminRoleProps,
    | 'afterSalesResolutionDrafts'
    | 'buildAfterSalesResolutionPayload'
    | 'resolveAfterSalesTicket'
    | 'runAction'
    | 'setAfterSalesResolutionDrafts'
  >
  ticket: AdminTicket
}) {
  const resolutionMode = draft?.resolutionMode ?? AFTER_SALES_DEFAULTS.defaultMode
  const isCompensation = ticket.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest
  const needsAmount = resolutionMode !== AFTER_SALES_RESOLUTION_MODE.manual

  return (
    <div className="ticket-actions afterSales-ticket-actions">
      <select
        value={resolutionMode}
        onChange={(event) =>
          props.setAfterSalesResolutionDrafts((current: Record<TicketId, AfterSalesResolutionDraft>) =>
            updateAfterSalesResolutionDraft(current, ticket.id, {
              resolutionMode: getAfterSalesResolutionMode(event.target.value),
            }),
          )
        }
      >
        <option value={AFTER_SALES_RESOLUTION_MODE.balance}>退回余额</option>
        <option value={AFTER_SALES_RESOLUTION_MODE.coupon}>补发优惠券</option>
        <option value={AFTER_SALES_RESOLUTION_MODE.manual}>仅记录处理结果</option>
      </select>
      {needsAmount ? (
        <input
          min="0"
          placeholder={isCompensation ? '补偿金额（元）' : '退款金额（元，不填则默认实付金额）'}
          step="0.01"
          type="number"
          value={draft?.actualCompensationYuan ?? ''}
          onChange={(event) =>
            props.setAfterSalesResolutionDrafts((current: Record<TicketId, AfterSalesResolutionDraft>) =>
              updateAfterSalesResolutionDraft(current, ticket.id, {
                actualCompensationYuan: asDomainText<DisplayText>(event.target.value),
              }),
            )
          }
        />
      ) : null}
      <input
        value={draft?.resolutionNote ?? AFTER_SALES_DEFAULTS.approvedNote}
        onChange={(event) =>
          props.setAfterSalesResolutionDrafts((current: Record<TicketId, AfterSalesResolutionDraft>) =>
              updateAfterSalesResolutionDraft(current, ticket.id, {
              resolutionNote: asDomainText<ResolutionText>(event.target.value),
            }),
          )
        }
      />
      <button
        className="primary-button"
        onClick={() =>
          void props.runAction(() =>
            props.resolveAfterSalesTicket(
              ticket.id,
              props.buildAfterSalesResolutionPayload(true, props.afterSalesResolutionDrafts[ticket.id]),
            ),
          )
        }
        type="button"
      >
        同意售后
      </button>
      <button
        className="secondary-button"
        onClick={() =>
          void props.runAction(() =>
            props.resolveAfterSalesTicket(
              ticket.id,
              props.buildAfterSalesResolutionPayload(false, {
                ...(props.afterSalesResolutionDrafts[ticket.id] ?? createInitialAfterSalesDraft()),
                approved: asDomainBoolean<ApprovalFlag>(false),
                resolutionNote:
                  props.afterSalesResolutionDrafts[ticket.id]?.resolutionNote ??
                  asDomainText<ResolutionText>(AFTER_SALES_DEFAULTS.rejectedNote),
              }),
            ),
          )
        }
        type="button"
      >
        驳回申请
      </button>
    </div>
  )
}

export function AdminAfterSalesResolvedSummary({
  formatTime,
  ticket,
}: {
  formatTime: AdminRoleProps['formatTime']
  ticket: AdminTicket
}) {
  return (
    <p className="meta-line afterSales-ticket-result">
      {ticket.reviewedAt ? `处理于 ${formatTime(ticket.reviewedAt)} · ` : ''}
      {ticket.approved ? '已通过' : '已驳回'}
      {ticket.resolutionMode === AFTER_SALES_RESOLUTION_MODE.coupon && ticket.issuedCoupon ? ` · 已补发 ${ticket.issuedCoupon.title}` : ''}
      {ticket.actualCompensationCents ? ` · 实际处理金额 ${formatPrice(ticket.actualCompensationCents)}` : ''}
      {ticket.resolutionNote ? ` · ${ticket.resolutionNote}` : ''}
    </p>
  )
}
