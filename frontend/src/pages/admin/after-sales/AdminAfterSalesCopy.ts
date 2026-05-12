import {
  AFTER_SALES_QUEUE,
  type AfterSalesDateRange,
  type AfterSalesQueue,
  type AfterSalesQueueOption,
} from '@/pages/admin/object/AdminPageObjects'
import {
  AFTER_SALES_APPROVED_NOTE,
  AFTER_SALES_REJECTED_STANDARD_NOTE,
} from '@/shared/delivery/DeliveryServices'
import type { AfterSalesResolutionDraft } from '@/shared/object/core/DeliveryAppObjects'
import {
  AFTER_SALES_RESOLUTION_MODE,
  TICKET_STATUS,
  type AdminTicket,
} from '@/shared/object/core/SharedObjects'

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
  { value: AFTER_SALES_QUEUE.resolved, label: '已处理' },
  { value: AFTER_SALES_QUEUE.all, label: '全部' },
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
    .filter((value): value is string => Boolean(value))
    .some((value) => {
      const ticketTime = new Date(value).getTime()
      if (Number.isNaN(ticketTime)) return false
      return (fromTime === undefined || ticketTime >= fromTime) && (toTime === undefined || ticketTime <= toTime)
    })
}

export function createInitialAfterSalesDraft() {
  return {
    approved: true,
    resolutionNote: AFTER_SALES_DEFAULTS.approvedNote,
    resolutionMode: AFTER_SALES_DEFAULTS.defaultMode,
    actualCompensationYuan: '',
  } satisfies AfterSalesResolutionDraft
}

export function updateAfterSalesResolutionDraft(
  current: Record<string, AfterSalesResolutionDraft>,
  ticketId: string,
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
