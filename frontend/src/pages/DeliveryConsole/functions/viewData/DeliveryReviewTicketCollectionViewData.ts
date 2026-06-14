import type { DeliveryAppState } from '@/objects/core/SharedObjects'
import { APPLICATION_STATUS, TICKET_KIND } from '@/objects/core/SharedObjects'
import type { DeliveryPageDerivedState } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'

export function getReviewAndTicketCollections(state: DeliveryPageDerivedState) {
  return {
    pendingAppeals:
      state?.reviewAppeals.filter(
        (entry: DeliveryAppState['reviewAppeals'][number]) =>
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    pendingEligibilityReviews:
      state?.eligibilityReviews.filter(
        (entry: DeliveryAppState['eligibilityReviews'][number]) =>
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    afterSalesTickets:
      state?.tickets.filter(
        (entry: DeliveryAppState['tickets'][number]) => entry.kind === TICKET_KIND.deliveryIssue,
      ) ?? [],
  }
}
