import { useMemo, useState } from 'react'
import { TICKET_STATUS } from '@/objects/core/SharedObjects'
import type { AdminTicket } from '@/objects/core/SharedObjects'
import {
  AFTER_SALES_PAGE_SIZE,
  getNextAfterSalesDateRange,
  isAfterSalesDateRangeMatch,
  isAfterSalesQueueMatch,
} from '@/pages/AdminConsole/components/afterSales/AdminAfterSalesCopy'
import {
  AFTER_SALES_QUEUE,
  type AfterSalesDateRange,
  type AfterSalesQueue,
} from '@/pages/AdminConsole/objects/AdminPageObjects'

export function useAdminAfterSalesState(afterSalesTickets: AdminTicket[]) {
  const [selectedQueue, setSelectedQueue] = useState<AfterSalesQueue>(AFTER_SALES_QUEUE.open)
  const [dateRange, setDateRange] = useState<AfterSalesDateRange>({ from: '', to: '' })
  const [selectedPage, setSelectedPage] = useState(1)

  function updateDateRange(field: keyof AfterSalesDateRange, value: string) {
    setDateRange((current) => getNextAfterSalesDateRange(current, field, value))
    setSelectedPage(1)
  }

  const visibleAfterSalesTickets = useMemo(
    () =>
      afterSalesTickets.filter(
        (ticket) =>
          ticket.status === TICKET_STATUS.open &&
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
  const openTicketCount = afterSalesTickets.filter((ticket) => ticket.status === TICKET_STATUS.open).length

  function resetDateRange() {
    setDateRange({ from: '', to: '' })
    setSelectedPage(1)
  }

  function selectQueue(queue: AfterSalesQueue) {
    setSelectedQueue(queue)
    setSelectedPage(1)
  }

  return {
    selectedQueue,
    selectQueue,
    dateRange,
    resetDateRange,
    updateDateRange,
    setSelectedPage,
    visibleAfterSalesTickets,
    pageCount,
    currentPage,
    pagedAfterSalesTickets,
    openTicketCount,
  }
}
