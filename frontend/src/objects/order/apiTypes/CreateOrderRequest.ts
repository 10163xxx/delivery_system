// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type {
  AddressText,
  CouponId,
  CustomerId,
  IsoDateTime,
  NoteText,
  StoreId,
} from '@/objects/core/SharedObjects'
import type { OrderItemInput } from '@/objects/order/apiTypes/OrderItemInput'

export type CreateOrderRequest = {
  customerId: CustomerId
  storeId: StoreId
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  couponId?: CouponId
  items: OrderItemInput[]
}
