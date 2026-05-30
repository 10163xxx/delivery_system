import type { Coupon } from '@/objects/customer/profile/Coupon'
import type { Customer } from '@/objects/customer/profile/Customer'
import type { Store } from '@/objects/merchant/store/Store'
import type { OrderLineItem } from '@/objects/order/core/OrderLineItem'
import type { OrderPriceBreakdown } from '@/objects/order/core/OrderPriceBreakdown'
import type { OrderSummary } from '@/objects/order/core/OrderSummary'
import type { ReviewOrderRequest } from '@/objects/review/ReviewOrderRequest'
import type {
  AddressText,
  IsoDateTime,
  NoteText,
  ReasonText,
} from '@/objects/domain/DomainObjects'

export type CreateOrderContext = {
  customer: Customer
  store: Store
  timestamp: IsoDateTime
  items: OrderLineItem[]
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  appliedCoupon?: Coupon
  priceBreakdown: OrderPriceBreakdown
  remark?: NoteText
}

export type RejectOrderContext = {
  order: OrderSummary
  reason: ReasonText
  timestamp: IsoDateTime
}

export type ReviewOrderContext = {
  order: OrderSummary
  customer: Customer
  timestamp: IsoDateTime
  sanitized: ReviewOrderRequest
}
