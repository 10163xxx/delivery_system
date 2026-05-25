import type { AdminRoleProps } from '@/shared/app/role-props'
import type { AdminTicket, TicketId } from '@/shared/object/core/SharedObjects'
import {
  AFTER_SALES_REQUEST_TYPE,
  AFTER_SALES_RESOLUTION_MODE,
  TICKET_STATUS,
} from '@/shared/object/core/SharedObjects'
import type { AfterSalesResolutionDraft } from '@/shared/object/core/DeliveryAppObjects'
import { formatPrice } from '@/shared/delivery/DeliveryServices'
import {
  AFTER_SALES_DEFAULTS,
  createInitialAfterSalesDraft,
  getAfterSalesResolutionMode,
  updateAfterSalesResolutionDraft,
} from '@/pages/admin/after-sales/AdminAfterSalesCopy'

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
      <div className="after-sales-ticket-main">
        <p className="ticket-kind">{ticket.requestType === AFTER_SALES_REQUEST_TYPE.returnRequest ? '退货售后' : '赔偿售后'}</p>
        <h3>订单 {ticket.orderId}</h3>
        <span className={ticket.status === TICKET_STATUS.open ? 'badge warning' : 'badge success'}>
          {ticket.status === TICKET_STATUS.open ? '待审核' : ticket.approved ? '已通过' : '已驳回'}
        </span>
      </div>
      <div className="after-sales-ticket-detail">
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
    <div className="ticket-actions after-sales-ticket-actions">
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
                actualCompensationYuan: event.target.value,
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
              resolutionNote: event.target.value,
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
                approved: false,
                resolutionNote: props.afterSalesResolutionDrafts[ticket.id]?.resolutionNote ?? AFTER_SALES_DEFAULTS.rejectedNote,
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
    <p className="meta-line after-sales-ticket-result">
      {ticket.reviewedAt ? `处理于 ${formatTime(ticket.reviewedAt)} · ` : ''}
      {ticket.approved ? '已通过' : '已驳回'}
      {ticket.resolutionMode === AFTER_SALES_RESOLUTION_MODE.coupon && ticket.issuedCoupon ? ` · 已补发 ${ticket.issuedCoupon.title}` : ''}
      {ticket.actualCompensationCents ? ` · 实际处理金额 ${formatPrice(ticket.actualCompensationCents)}` : ''}
      {ticket.resolutionNote ? ` · ${ticket.resolutionNote}` : ''}
    </p>
  )
}
