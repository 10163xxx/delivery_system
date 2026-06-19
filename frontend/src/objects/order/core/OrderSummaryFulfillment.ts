// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AddressText,
  IsoDateTime,
  NoteText,
  OrderStatus,
} from '@/objects/core/SharedObjects'
import type { OrderLineItem } from '@/objects/order/core/OrderLineItem'

export type OrderSummaryFulfillment = {
  status: OrderStatus
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  items: OrderLineItem[]
}
