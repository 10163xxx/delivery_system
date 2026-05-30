import type {
  AddressText,
  CurrencyCents,
  CustomerId,
  DescriptionText,
  DisplayText,
  IsoDateTime,
  NoteText,
  OrderId,
  OrderStatus,
  PersonName,
  RatingValue,
  ReasonText,
  ReviewStatus,
  RiderId,
  StoreId,
} from '@/objects/domain/DomainObjects'
import type { Coupon } from '@/objects/customer/profile/Coupon'
import type { OrderChatMessage } from '@/objects/order/core/OrderChatMessage'
import type { OrderLineItem } from '@/objects/order/core/OrderLineItem'
import type { OrderTimelineEntry } from '@/objects/order/core/OrderTimelineEntry'
import type { OrderPartialRefundRequest } from '@/objects/order/afterSales/OrderPartialRefundRequest'

export type OrderSummaryIdentity = {
  id: OrderId
  customerId: CustomerId
  customerName: PersonName
  storeId: StoreId
  storeName: DisplayText
  riderId?: RiderId
  riderName?: PersonName
}

export type OrderSummaryFulfillment = {
  status: OrderStatus
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  items: OrderLineItem[]
}

export type OrderSummaryPricing = {
  itemSubtotalCents: CurrencyCents
  deliveryFeeCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  appliedCoupon?: Coupon
  totalPriceCents: CurrencyCents
}

export type OrderSummaryLifecycle = {
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export type OrderSummaryActivity = {
  timeline: OrderTimelineEntry[]
  chatMessages: OrderChatMessage[]
  partialRefundRequests: OrderPartialRefundRequest[]
}

export type OrderSummaryReviewState = {
  storeRating?: RatingValue
  riderRating?: RatingValue
  merchantRejectReason?: ReasonText
  reviewStatus: ReviewStatus
  reviewRevokedReason?: ReasonText
  reviewRevokedAt?: IsoDateTime
}

export type OrderSummaryReviewContent = {
  reviewComment?: DescriptionText
  reviewExtraNote?: NoteText
  storeReviewComment?: DescriptionText
  storeReviewExtraNote?: NoteText
  storeMerchantReply?: NoteText
  storeMerchantReplyAt?: IsoDateTime
  riderReviewComment?: DescriptionText
  riderReviewExtraNote?: NoteText
}

export type OrderSummary = {
  identity: OrderSummaryIdentity
  fulfillment: OrderSummaryFulfillment
  pricing: OrderSummaryPricing
  lifecycle: OrderSummaryLifecycle
  reviewState: OrderSummaryReviewState
  reviewContent: OrderSummaryReviewContent
  activity: OrderSummaryActivity
} & OrderSummaryIdentity &
  OrderSummaryFulfillment &
  OrderSummaryPricing &
  OrderSummaryLifecycle &
  OrderSummaryActivity &
  OrderSummaryReviewState &
  OrderSummaryReviewContent
