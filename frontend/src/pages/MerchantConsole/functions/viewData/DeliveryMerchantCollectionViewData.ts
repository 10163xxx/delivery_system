import type {
  DeliveryAppState,
  Store,
} from '@/objects/core/SharedObjects'
import { APPLICATION_STATUS, ROLE } from '@/objects/core/SharedObjects'
import type {
  DeliveryPageDerivedState,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'

export function getMerchantStores(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
) {
  return (
    state?.stores.filter((store: Store) =>
      session?.user.role === ROLE.merchant
        ? store.merchantName === session.user.displayName
        : true,
    ) ?? []
  )
}

export function getMerchantApplicationCollections(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
) {
  return {
    pendingApplications:
      state?.merchantApplications.filter(
        (entry: DeliveryAppState['merchantApplications'][number]) =>
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    merchantPendingApplications:
      state?.merchantApplications.filter(
        (entry: DeliveryAppState['merchantApplications'][number]) =>
          entry.merchantName === session?.user.displayName &&
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    merchantReviewedApplications:
      state?.merchantApplications.filter(
        (entry: DeliveryAppState['merchantApplications'][number]) =>
          entry.merchantName === session?.user.displayName &&
          entry.status !== APPLICATION_STATUS.pending,
      ) ?? [],
  }
}
