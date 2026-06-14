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
