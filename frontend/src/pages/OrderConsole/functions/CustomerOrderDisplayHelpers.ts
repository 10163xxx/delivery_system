import type { Dispatch, SetStateAction } from 'react'
import {
  TICKET_KIND,
  TICKET_STATUS,
  type AdminTicket,
} from '@/objects/core/SharedObjects'
import type { CustomerOrderHelpersProps } from '@/pages/OrderConsole/objects/OrderPageObjects'
import { ORDER_PAGE_COPY } from '@/pages/OrderConsole/OrderPageCopy'

export function isDeliveryIssueTicket(ticket: AdminTicket, orderId: string) {
  return ticket.orderId === orderId && ticket.kind === TICKET_KIND.deliveryIssue
}

export function clearRecordError<K extends string, V>(
  key: K,
  setErrors: Dispatch<SetStateAction<Record<K, V>>>,
) {
  setErrors((current) => {
    if (!current[key]) return current
    const next = { ...current }
    delete next[key]
    return next
  })
}

export function getAfterSalesSummary(
  orderTicket: AdminTicket | undefined,
  formatPrice: CustomerOrderHelpersProps['formatPrice'],
) {
  if (!orderTicket) {
    return ORDER_PAGE_COPY.display.noAfterSalesSummary
  }

  if (orderTicket.status === TICKET_STATUS.open) {
    return `${ORDER_PAGE_COPY.display.afterSalesPendingPrefix}${orderTicket.summary}`
  }

  return `${ORDER_PAGE_COPY.display.afterSalesResolvedSummary(
    orderTicket.approved
      ? ORDER_PAGE_COPY.display.afterSalesApprovedLabel
      : ORDER_PAGE_COPY.display.afterSalesRejectedLabel,
    orderTicket.resolutionNote ?? orderTicket.summary,
  )}${
    orderTicket.issuedCoupon
      ? `${ORDER_PAGE_COPY.display.issuedCouponPrefix}${orderTicket.issuedCoupon.title}`
      : ''
  }${
    orderTicket.actualCompensationCents
      ? `${ORDER_PAGE_COPY.display.compensationPrefix}${formatPrice(orderTicket.actualCompensationCents)}`
      : ''
  }`
}
