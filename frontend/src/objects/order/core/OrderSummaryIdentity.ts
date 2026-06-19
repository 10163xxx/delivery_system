// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  CustomerId,
  DisplayText,
  OrderId,
  PersonName,
  RiderId,
  StoreId,
} from '@/objects/core/SharedObjects'

export type OrderSummaryIdentity = {
  id: OrderId
  customerId: CustomerId
  customerName: PersonName
  storeId: StoreId
  storeName: DisplayText
  riderId?: RiderId
  riderName?: PersonName
}
