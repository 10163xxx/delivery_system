import type {
  AddressText,
  CouponId,
  CustomerId,
  IsoDateTime,
  NoteText,
  StoreId,
} from '@/shared/object/domain/DomainObjects'
import type { OrderItemInput } from '@/order/object/core/OrderItemInput'

export type CreateOrderRequest = {
  customerId: CustomerId
  storeId: StoreId
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  couponId?: CouponId
  items: OrderItemInput[]
}
