// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  CustomerId,
  OrderId,
  PersonName,
  ReviewAppealId,
  RiderId,
  StoreId,
} from '@/objects/core/SharedObjects'

export type ReviewAppealIdentity = {
  id: ReviewAppealId
  orderId: OrderId
  customerId: CustomerId
  customerName: PersonName
  storeId: StoreId
  riderId?: RiderId
}
