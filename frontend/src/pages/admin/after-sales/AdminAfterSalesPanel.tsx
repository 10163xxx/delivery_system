import type { AdminRoleProps } from '@/shared/app/role-props'
import type {
  AfterSalesDateRange,
  AfterSalesDateRangeFilterProps,
  AfterSalesPaginationProps,
  AfterSalesQueue,
} from '@/pages/admin/object/AdminPageObjects'
import { AFTER_SALES_QUEUE } from '@/pages/admin/object/AdminPageObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import { TICKET_STATUS, type AdminTicket } from '@/shared/object/core/SharedObjects'
import { AdminAfterSalesTicketCard } from '@/pages/admin/after-sales/AdminAfterSalesTicketCard'
import {
  AFTER_SALES_PAGE_SIZE,
  AFTER_SALES_QUEUE_OPTIONS,
  getNextAfterSalesDateRange,
  isAfterSalesDateRangeMatch,
  isAfterSalesQueueMatch,
} from '@/pages/admin/after-sales/AdminAfterSalesCopy'
import { useMemo, useState } from 'react'

function AfterSalesDateRangeFilters({
  dateRange,
  resetDateRange,
  updateDateRange,
}: AfterSalesDateRangeFilterProps) {
  return (
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
        onClick={resetDateRange}
        type="button"
      >
        清空时间段
      </button>
    </div>
  )
}

function AfterSalesPagination({
  currentPage,
  pageCount,
  setSelectedPage,
}: AfterSalesPaginationProps) {
  if (pageCount <= 1) return null

  return (
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
  )
}

export function AfterSalesTicketsPanel({ props }: { props: AdminRoleProps }) {
  const { afterSalesTickets } = props
  const [selectedQueue, setSelectedQueue] = useState<AfterSalesQueue>(AFTER_SALES_QUEUE.open)
  const [dateRange, setDateRange] = useState<AfterSalesDateRange>({ from: '', to: '' })
  const [selectedPage, setSelectedPage] = useState(1)
  function updateDateRange(field: keyof AfterSalesDateRange, value: string) {
    setDateRange((current) => getNextAfterSalesDateRange(current, field, value))
    setSelectedPage(1)
    if (value) setSelectedQueue(AFTER_SALES_QUEUE.all)
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
  function resetDateRange() {
    setDateRange({ from: '', to: '' })
    setSelectedPage(1)
  }

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
                {option.value === AFTER_SALES_QUEUE.open
                  ? openTicketCount
                  : option.value === AFTER_SALES_QUEUE.resolved
                    ? resolvedTicketCount
                    : afterSalesTickets.length}
              </strong>
            </button>
          ))}
        </div>
        <div className="after-sales-workspace">
          <AfterSalesDateRangeFilters
            dateRange={dateRange}
            resetDateRange={resetDateRange}
            updateDateRange={updateDateRange}
          />
          <div className="after-sales-ticket-list">
            {pagedAfterSalesTickets.length === 0 ? (
              <div className="empty-card">当前筛选条件下没有售后申请。</div>
            ) : (
              pagedAfterSalesTickets.map((ticket: AdminTicket) => (
                <AdminAfterSalesTicketCard key={ticket.id} props={props} ticket={ticket} />
              ))
            )}
          </div>
          <AfterSalesPagination
            currentPage={currentPage}
            pageCount={pageCount}
            setSelectedPage={setSelectedPage}
          />
        </div>
      </div>
    </Panel>
  )
}
