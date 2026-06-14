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
