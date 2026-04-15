import type { AdminRoleProps } from '@/shared/AppBuildRoleProps'
import { Panel } from '@/shared/components/LayoutPrimitives'
import {
  AFTER_SALES_REQUEST_TYPE,
  AFTER_SALES_RESOLUTION_MODE,
  TICKET_STATUS,
  type AdminTicket,
} from '@/shared/object/SharedObjects'
import type { AfterSalesResolutionDraft } from '@/shared/delivery-app/DeliveryAppObjects'
import { AFTER_SALES_APPROVED_NOTE, AFTER_SALES_REJECTED_STANDARD_NOTE } from '@/shared/delivery/DeliveryServices'
import { useMemo, useState } from 'react'

type AfterSalesQueue = 'open' | 'resolved' | 'all'

type AfterSalesDateRange = {
  from: string
  to: string
}

const AFTER_SALES_DEFAULTS = {
  approvedNote: AFTER_SALES_APPROVED_NOTE,
  rejectedNote: AFTER_SALES_REJECTED_STANDARD_NOTE,
  defaultMode: AFTER_SALES_RESOLUTION_MODE.balance,
} as const

const AFTER_SALES_PAGE_SIZE = 5

const AFTER_SALES_QUEUE_OPTIONS: Array<{ value: AfterSalesQueue; label: string }> = [
  { value: 'open', label: '待处理' },
  { value: 'resolved', label: '已处理' },
  { value: 'all', label: '全部' },
]

function getNextAfterSalesDateRange(
  current: AfterSalesDateRange,
  field: keyof AfterSalesDateRange,
  value: string,
) {
  return { ...current, [field]: value }
}

function getAfterSalesResolutionMode(
  value: string,
): AfterSalesResolutionDraft['resolutionMode'] {
  return value === AFTER_SALES_RESOLUTION_MODE.coupon || value === AFTER_SALES_RESOLUTION_MODE.manual
    ? value
    : AFTER_SALES_RESOLUTION_MODE.balance
}

function isAfterSalesQueueMatch(ticket: AdminTicket, queue: AfterSalesQueue) {
  if (queue === 'all') return true
  if (queue === 'open') return ticket.status === TICKET_STATUS.open
  return ticket.status !== TICKET_STATUS.open
}

function parseAfterSalesDateBoundary(value: string, boundary: 'start' | 'end') {
  if (!value) return undefined
  const suffix = boundary === 'start' ? 'T00:00:00' : 'T23:59:59'
  const time = new Date(`${value}${suffix}`).getTime()
  return Number.isNaN(time) ? undefined : time
}

function isAfterSalesDateRangeMatch(ticket: AdminTicket, dateRange: AfterSalesDateRange) {
  const fromTime = parseAfterSalesDateBoundary(dateRange.from, 'start')
  const toTime = parseAfterSalesDateBoundary(dateRange.to, 'end')
  if (fromTime === undefined && toTime === undefined) return true

  return [ticket.submittedAt, ticket.reviewedAt, ticket.updatedAt]
    .filter((value): value is string => Boolean(value))
    .some((value) => {
      const ticketTime = new Date(value).getTime()
      if (Number.isNaN(ticketTime)) return false
      return (fromTime === undefined || ticketTime >= fromTime) && (toTime === undefined || ticketTime <= toTime)
    })
}

function AfterSalesTicketCard({
  ticket,
  props,
}: {
  ticket: AdminTicket
  props: AdminRoleProps
}) {
  const {
    afterSalesResolutionDrafts,
    formatTime,
    setAfterSalesResolutionDrafts,
    runAction,
    buildAfterSalesResolutionPayload,
    resolveAfterSalesTicket,
  } = props
  const draft = afterSalesResolutionDrafts[ticket.id]
  const isCompensation = ticket.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest
  const resolutionMode = draft?.resolutionMode ?? AFTER_SALES_DEFAULTS.defaultMode
  const needsAmount = resolutionMode !== AFTER_SALES_RESOLUTION_MODE.manual

  return (
    <article className="ticket-card after-sales-ticket-row">
      <div className="after-sales-ticket-main">
        <p className="ticket-kind">
          {ticket.requestType === AFTER_SALES_REQUEST_TYPE.returnRequest ? '退货售后' : '赔偿售后'}
        </p>
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
        {isCompensation && ticket.expectedCompensationCents ? (
          <p className="meta-line">
            期望赔偿 ¥{(ticket.expectedCompensationCents / 100).toFixed(2)}
          </p>
        ) : null}
      </div>
      {ticket.status === TICKET_STATUS.open ? (
        <div className="ticket-actions after-sales-ticket-actions">
          <select
            value={resolutionMode}
            onChange={(event) =>
              setAfterSalesResolutionDrafts((current: Record<string, AfterSalesResolutionDraft>) => ({
                ...current,
                [ticket.id]: {
                  approved: current[ticket.id]?.approved ?? true,
                  resolutionNote:
                    current[ticket.id]?.resolutionNote ?? AFTER_SALES_DEFAULTS.approvedNote,
                  resolutionMode: getAfterSalesResolutionMode(event.target.value),
                  actualCompensationYuan: current[ticket.id]?.actualCompensationYuan ?? '',
                },
              }))
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
                setAfterSalesResolutionDrafts((current: Record<string, AfterSalesResolutionDraft>) => ({
                  ...current,
                  [ticket.id]: {
                    approved: current[ticket.id]?.approved ?? true,
                    resolutionNote:
                      current[ticket.id]?.resolutionNote ?? AFTER_SALES_DEFAULTS.approvedNote,
                    resolutionMode:
                      current[ticket.id]?.resolutionMode ?? AFTER_SALES_DEFAULTS.defaultMode,
                    actualCompensationYuan: event.target.value,
                  },
                }))
              }
            />
          ) : null}
          <input
            value={draft?.resolutionNote ?? AFTER_SALES_DEFAULTS.approvedNote}
            onChange={(event) =>
              setAfterSalesResolutionDrafts((current: Record<string, AfterSalesResolutionDraft>) => ({
                ...current,
                [ticket.id]: {
                  approved: current[ticket.id]?.approved ?? true,
                  resolutionMode:
                    current[ticket.id]?.resolutionMode ?? AFTER_SALES_DEFAULTS.defaultMode,
                  actualCompensationYuan: current[ticket.id]?.actualCompensationYuan ?? '',
                  resolutionNote: event.target.value,
                },
              }))
            }
          />
          <button
            className="primary-button"
            onClick={() =>
              void runAction(() =>
                resolveAfterSalesTicket(
                  ticket.id,
                  buildAfterSalesResolutionPayload(true, afterSalesResolutionDrafts[ticket.id]),
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
              void runAction(() =>
                resolveAfterSalesTicket(
                  ticket.id,
                  buildAfterSalesResolutionPayload(false, {
                    ...(afterSalesResolutionDrafts[ticket.id] ?? {
                      approved: true,
                      resolutionNote: AFTER_SALES_DEFAULTS.approvedNote,
                      resolutionMode: AFTER_SALES_DEFAULTS.defaultMode,
                      actualCompensationYuan: '',
                    }),
                    approved: false,
                    resolutionNote:
                      afterSalesResolutionDrafts[ticket.id]?.resolutionNote ??
                      AFTER_SALES_DEFAULTS.rejectedNote,
                  }),
                ),
              )
            }
            type="button"
          >
            驳回申请
          </button>
        </div>
      ) : (
        <p className="meta-line after-sales-ticket-result">
          {ticket.reviewedAt ? `处理于 ${formatTime(ticket.reviewedAt)} · ` : ''}
          {ticket.approved ? '已通过' : '已驳回'}
          {ticket.resolutionMode === AFTER_SALES_RESOLUTION_MODE.coupon && ticket.issuedCoupon
            ? ` · 已补发 ${ticket.issuedCoupon.title}`
            : ''}
          {ticket.actualCompensationCents
            ? ` · 实际处理金额 ¥${(ticket.actualCompensationCents / 100).toFixed(2)}`
            : ''}
          {ticket.resolutionNote ? ` · ${ticket.resolutionNote}` : ''}
        </p>
      )}
    </article>
  )
}

export function AfterSalesTicketsPanel({ props }: { props: AdminRoleProps }) {
  const { afterSalesTickets } = props
  const [selectedQueue, setSelectedQueue] = useState<AfterSalesQueue>('open')
  const [dateRange, setDateRange] = useState<AfterSalesDateRange>({ from: '', to: '' })
  const [selectedPage, setSelectedPage] = useState(1)
  function updateDateRange(field: keyof AfterSalesDateRange, value: string) {
    setDateRange((current) => getNextAfterSalesDateRange(current, field, value))
    setSelectedPage(1)
    if (value) setSelectedQueue('all')
  }

  const visibleAfterSalesTickets = useMemo(
    () =>
      afterSalesTickets.filter(
        (ticket) =>
          isAfterSalesQueueMatch(ticket, selectedQueue) &&
          isAfterSalesDateRangeMatch(ticket, dateRange),
      ),
    [afterSalesTickets, dateRange, selectedQueue],
  )
  const pageCount = Math.ceil(visibleAfterSalesTickets.length / AFTER_SALES_PAGE_SIZE)
  const currentPage = Math.min(selectedPage, pageCount || 1)
  const pagedAfterSalesTickets = visibleAfterSalesTickets.slice(
    (currentPage - 1) * AFTER_SALES_PAGE_SIZE,
    currentPage * AFTER_SALES_PAGE_SIZE,
  )
  const openTicketCount = afterSalesTickets.filter(
    (ticket) => ticket.status === TICKET_STATUS.open,
  ).length
  const resolvedTicketCount = afterSalesTickets.length - openTicketCount

  return (
    <Panel title="售后申请处理" description="审核顾客提交的退货或赔偿申请，并回写最终处理结果。">
      <div className="after-sales-console">
        <div className="after-sales-rail" aria-label="售后处理分类">
          {AFTER_SALES_QUEUE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`after-sales-rail-button${selectedQueue === option.value ? ' is-active' : ''}`}
              onClick={() => {
                setSelectedQueue(option.value)
                setSelectedPage(1)
              }}
              type="button"
            >
              <span>{option.label}</span>
              <strong>
                {option.value === 'open'
                  ? openTicketCount
                  : option.value === 'resolved'
                    ? resolvedTicketCount
                    : afterSalesTickets.length}
              </strong>
            </button>
          ))}
        </div>
        <div className="after-sales-workspace">
          <div className="after-sales-date-range" aria-label="售后时间段筛选">
            <label>
              <span>开始日期</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(event) => updateDateRange('from', event.target.value)}
              />
            </label>
            <label>
              <span>结束日期</span>
              <input
                min={dateRange.from || undefined}
                type="date"
                value={dateRange.to}
                onChange={(event) => updateDateRange('to', event.target.value)}
              />
            </label>
            <button
              className="secondary-button after-sales-date-reset"
              disabled={!dateRange.from && !dateRange.to}
              onClick={() => {
                setDateRange({ from: '', to: '' })
                setSelectedPage(1)
              }}
              type="button"
            >
              清空时间段
            </button>
          </div>
          <div className="after-sales-ticket-list">
            {pagedAfterSalesTickets.length === 0 ? (
              <div className="empty-card">当前筛选条件下没有售后申请。</div>
            ) : (
              pagedAfterSalesTickets.map((ticket) => (
                <AfterSalesTicketCard key={ticket.id} props={props} ticket={ticket} />
              ))
            )}
          </div>
          {pageCount > 1 ? (
            <div className="after-sales-pagination" aria-label="售后申请分组">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`after-sales-page-button${currentPage === page ? ' is-active' : ''}`}
                  onClick={() => setSelectedPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  )
}
