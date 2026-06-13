import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { AdminTicket } from '@/objects/core/SharedObjects'
import {
  AdminAfterSalesOpenActions,
  AdminAfterSalesResolvedSummary,
  AdminAfterSalesTicketHeader,
} from '@/pages/AdminConsole/components/afterSales/AdminAfterSalesTicketSections'
import { TICKET_STATUS } from '@/objects/core/SharedObjects'

export function AdminAfterSalesTicketCard({
  ticket,
  props,
}: {
  ticket: AdminTicket
  props: AdminRoleProps
}) {
  const {
    afterSalesResolutionDrafts,
    formatTime,
  } = props
  const draft = afterSalesResolutionDrafts[ticket.id]

  return (
    <article className="ticket-card afterSales-ticket-row">
      <AdminAfterSalesTicketHeader formatTime={formatTime} ticket={ticket} />
      {ticket.status === TICKET_STATUS.open ? (
        <AdminAfterSalesOpenActions draft={draft} props={props} ticket={ticket} />
      ) : (
        <AdminAfterSalesResolvedSummary formatTime={formatTime} ticket={ticket} />
      )}
    </article>
  )
}
