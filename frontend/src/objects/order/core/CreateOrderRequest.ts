import type {
  AddressText,
  CouponId,
  CustomerId,
  IsoDateTime,
  NoteText,
  StoreId,
} from '@/objects/domain/DomainObjects'
import type { OrderItemInput } from '@/objects/order/core/OrderItemInput'

export type CreateOrderRequest = {
  customerId: CustomerId
  storeId: StoreId
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  couponId?: CouponId
  items: OrderItemInput[]
}
