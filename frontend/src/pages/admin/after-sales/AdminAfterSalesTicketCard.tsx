import type { AdminRoleProps } from '@/shared/app/role-props'
import type { AdminTicket } from '@/shared/object/core/SharedObjects'
import {
  AdminAfterSalesOpenActions,
  AdminAfterSalesResolvedSummary,
  AdminAfterSalesTicketHeader,
} from '@/pages/admin/after-sales/AdminAfterSalesTicketSections'
import { TICKET_STATUS } from '@/shared/object/core/SharedObjects'

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
    <article className="ticket-card after-sales-ticket-row">
      <AdminAfterSalesTicketHeader formatTime={formatTime} ticket={ticket} />
      {ticket.status === TICKET_STATUS.open ? (
        <AdminAfterSalesOpenActions draft={draft} props={props} ticket={ticket} />
      ) : (
        <AdminAfterSalesResolvedSummary formatTime={formatTime} ticket={ticket} />
      )}
    </article>
  )
}
