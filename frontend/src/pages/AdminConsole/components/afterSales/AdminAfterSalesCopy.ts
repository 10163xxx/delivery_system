import {
  AFTER_SALES_QUEUE,
  type AfterSalesDateRange,
  type AfterSalesQueue,
  type AfterSalesQueueOption,
} from '@/pages/AdminConsole/objects/AdminPageObjects'
import { AFTER_SALES_APPROVED_NOTE, AFTER_SALES_REJECTED_STANDARD_NOTE } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import type { AfterSalesResolutionDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import {
  AFTER_SALES_RESOLUTION_MODE,
  TICKET_STATUS,
  type ApprovalFlag,
  type AdminTicket,
  type DisplayText,
  type IsoDateTime,
  type TicketId,
} from '@/objects/core/SharedObjects'
import { asDomainBoolean, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export const AFTER_SALES_DEFAULTS = {
  approvedNote: AFTER_SALES_APPROVED_NOTE,
  rejectedNote: AFTER_SALES_REJECTED_STANDARD_NOTE,
  defaultMode: AFTER_SALES_RESOLUTION_MODE.balance,
  endDateTimeSuffix: 'T23:59:59',
  startDateTimeSuffix: 'T00:00:00',
} as const

export const AFTER_SALES_DATE_BOUNDARY = {
  start: 'start',
  end: 'end',
} as const

export type AfterSalesDateBoundary =
  (typeof AFTER_SALES_DATE_BOUNDARY)[keyof typeof AFTER_SALES_DATE_BOUNDARY]

export const AFTER_SALES_PAGE_SIZE = 5

export const AFTER_SALES_QUEUE_OPTIONS: AfterSalesQueueOption[] = [
  { value: AFTER_SALES_QUEUE.open, label: '待处理' },
]

export function getNextAfterSalesDateRange(
  current: AfterSalesDateRange,
  field: keyof AfterSalesDateRange,
  value: string,
) {
  return { ...current, [field]: value }
}

export function getAfterSalesResolutionMode(
  value: string,
): AfterSalesResolutionDraft['resolutionMode'] {
  return value === AFTER_SALES_RESOLUTION_MODE.coupon || value === AFTER_SALES_RESOLUTION_MODE.manual
    ? value
    : AFTER_SALES_RESOLUTION_MODE.balance
}

export function isAfterSalesQueueMatch(ticket: AdminTicket, queue: AfterSalesQueue) {
  if (queue === AFTER_SALES_QUEUE.all) return true
  if (queue === AFTER_SALES_QUEUE.open) return ticket.status === TICKET_STATUS.open
  return ticket.status !== TICKET_STATUS.open
}

export function parseAfterSalesDateBoundary(value: string, boundary: AfterSalesDateBoundary) {
  if (!value) return undefined
  const suffix =
    boundary === AFTER_SALES_DATE_BOUNDARY.start
      ? AFTER_SALES_DEFAULTS.startDateTimeSuffix
      : AFTER_SALES_DEFAULTS.endDateTimeSuffix
  const time = new Date(`${value}${suffix}`).getTime()
  return Number.isNaN(time) ? undefined : time
}

export function isAfterSalesDateRangeMatch(ticket: AdminTicket, dateRange: AfterSalesDateRange) {
  const fromTime = parseAfterSalesDateBoundary(dateRange.from, AFTER_SALES_DATE_BOUNDARY.start)
  const toTime = parseAfterSalesDateBoundary(dateRange.to, AFTER_SALES_DATE_BOUNDARY.end)
  if (fromTime === undefined && toTime === undefined) return true

  return [ticket.submittedAt, ticket.reviewedAt, ticket.updatedAt]
    .filter((value): value is IsoDateTime => Boolean(value))
    .some((value) => {
      const ticketTime = new Date(value).getTime()
      if (Number.isNaN(ticketTime)) return false
      return (fromTime === undefined || ticketTime >= fromTime) && (toTime === undefined || ticketTime <= toTime)
    })
}

export function createInitialAfterSalesDraft() {
  return {
    approved: asDomainBoolean<ApprovalFlag>(true),
    resolutionNote: AFTER_SALES_DEFAULTS.approvedNote,
    resolutionMode: AFTER_SALES_DEFAULTS.defaultMode,
    actualCompensationYuan: asDomainText<DisplayText>(''),
  } satisfies AfterSalesResolutionDraft
}

export function updateAfterSalesResolutionDraft(
  current: Record<TicketId, AfterSalesResolutionDraft>,
  ticketId: TicketId,
  patch: Partial<AfterSalesResolutionDraft>,
) {
  return {
    ...current,
    [ticketId]: {
      ...(current[ticketId] ?? createInitialAfterSalesDraft()),
      ...patch,
    },
  }
}
