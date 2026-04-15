import type { Coupon } from '@/customer/object/CustomerObjects'
import type {
  AddressText,
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ApprovalFlag,
  ChatMessageId,
  CouponId,
  CurrencyCents,
  CustomerId,
  DescriptionText,
  DisplayText,
  IsoDateTime,
  MenuItemId,
  NoteText,
  OrderStatus,
  OrderId,
  PartialRefundStatus,
  PersonName,
  Quantity,
  RatingValue,
  ReasonText,
  RefundRequestId,
  ResolutionText,
  ReviewStatus,
  Role,
  RiderId,
  StoreId,
} from '@/shared/object/domain/DomainObjects'

export type AuditedRecord = {
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}

export type ApprovalDecision = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}

export type OrderActorSnapshot = {
  customerId: CustomerId
  customerName: PersonName
  storeId: StoreId
  storeName: DisplayText
  riderId?: RiderId
  riderName?: PersonName
}

export type OrderPricing = {
  itemSubtotalCents: CurrencyCents
  deliveryFeeCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  appliedCoupon?: Coupon
  totalPriceCents: CurrencyCents
}

export type OrderReviewSnapshot = {
  storeRating?: RatingValue
  riderRating?: RatingValue
  reviewComment?: DescriptionText
  reviewExtraNote?: NoteText
  storeReviewComment?: DescriptionText
  storeReviewExtraNote?: NoteText
  riderReviewComment?: DescriptionText
  riderReviewExtraNote?: NoteText
  merchantRejectReason?: ReasonText
  reviewStatus: ReviewStatus
  reviewRevokedReason?: ReasonText
  reviewRevokedAt?: IsoDateTime
}

export type OrderTimelineEntry = {
  status: OrderStatus
  note: NoteText
  at: IsoDateTime
}

export type OrderChatMessage = {
  id: ChatMessageId
  senderRole: Role
  senderName: PersonName
  body: DescriptionText
  sentAt: IsoDateTime
}

export type OrderLineItem = {
  menuItemId: MenuItemId
  name: DisplayText
  quantity: Quantity
  unitPriceCents: CurrencyCents
  refundedQuantity: Quantity
}

export type OrderPartialRefundRequest = {
  id: RefundRequestId
  orderId: OrderId
  menuItemId: MenuItemId
  itemName: DisplayText
  quantity: Quantity
  reason: ReasonText
  status: PartialRefundStatus
  resolutionNote?: ResolutionText
} & AuditedRecord

export type OrderSummary = {
  id: OrderId
} & OrderActorSnapshot & {
  status: OrderStatus
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  items: OrderLineItem[]
} & OrderPricing & {
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
  timeline: OrderTimelineEntry[]
  chatMessages: OrderChatMessage[]
  partialRefundRequests: OrderPartialRefundRequest[]
} & OrderReviewSnapshot

export type OrderItemInput = {
  menuItemId: MenuItemId
  quantity: Quantity
}

export type CreateOrderRequest = {
  customerId: CustomerId
  storeId: StoreId
  deliveryAddress: AddressText
  scheduledDeliveryAt: IsoDateTime
  remark?: NoteText
  couponId?: CouponId
  items: OrderItemInput[]
}

export type ResolveAfterSalesRequest = ApprovalDecision & {
  resolutionNote: ResolutionText
  resolutionMode?: AfterSalesResolutionMode
  actualCompensationCents?: CurrencyCents
  couponMinimumSpendCents?: CurrencyCents
}

export type SubmitAfterSalesRequest = {
  requestType: AfterSalesRequestType
  reason: ReasonText
  expectedCompensationCents?: CurrencyCents
}

export type AssignRiderRequest = {
  riderId: RiderId
}

export type RejectOrderRequest = {
  reason: ReasonText
}

export type SendOrderChatMessageRequest = {
  body: DescriptionText
}

export type SubmitPartialRefundRequest = {
  menuItemId: MenuItemId
  quantity: Quantity
  reason: ReasonText
}

export type ResolvePartialRefundRequest = ApprovalDecision
