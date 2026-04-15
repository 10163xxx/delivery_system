package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.semiauto.*
import domain.customer.Coupon
import domain.shared.*

final case class OrderItemInput(menuItemId: MenuItemId, quantity: Quantity)
object OrderItemInput:
  given Encoder[OrderItemInput] = deriveEncoder
  given Decoder[OrderItemInput] = deriveDecoder

final case class CreateOrderRequest(
    customerId: CustomerId,
    storeId: StoreId,
    deliveryAddress: AddressText,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    couponId: Option[CouponId],
    items: List[OrderItemInput],
)
object CreateOrderRequest:
  given Encoder[CreateOrderRequest] = deriveEncoder
  given Decoder[CreateOrderRequest] = deriveDecoder

final case class AssignRiderRequest(riderId: RiderId)
object AssignRiderRequest:
  given Encoder[AssignRiderRequest] = deriveEncoder
  given Decoder[AssignRiderRequest] = deriveDecoder

final case class RejectOrderRequest(reason: ReasonText)
object RejectOrderRequest:
  given Encoder[RejectOrderRequest] = deriveEncoder
  given Decoder[RejectOrderRequest] = deriveDecoder

final case class ResolveAfterSalesRequest(
    approved: ApprovalFlag,
    resolutionNote: ResolutionText,
    resolutionMode: Option[AfterSalesResolutionMode],
    actualCompensationCents: Option[CurrencyCents],
    couponMinimumSpendCents: Option[CurrencyCents],
)
object ResolveAfterSalesRequest:
  given Encoder[ResolveAfterSalesRequest] = deriveEncoder
  given Decoder[ResolveAfterSalesRequest] = deriveDecoder

final case class SubmitAfterSalesRequest(
    requestType: AfterSalesRequestType,
    reason: ReasonText,
    expectedCompensationCents: Option[CurrencyCents],
)
object SubmitAfterSalesRequest:
  given Encoder[SubmitAfterSalesRequest] = deriveEncoder
  given Decoder[SubmitAfterSalesRequest] = deriveDecoder

final case class SendOrderChatMessageRequest(body: DisplayText)
object SendOrderChatMessageRequest:
  given Encoder[SendOrderChatMessageRequest] = deriveEncoder
  given Decoder[SendOrderChatMessageRequest] = deriveDecoder

final case class SubmitPartialRefundRequest(
    menuItemId: MenuItemId,
    quantity: Quantity,
    reason: ReasonText,
)
object SubmitPartialRefundRequest:
  given Encoder[SubmitPartialRefundRequest] = deriveEncoder
  given Decoder[SubmitPartialRefundRequest] = deriveDecoder

final case class ResolvePartialRefundRequest(
    approved: ApprovalFlag,
    resolutionNote: ResolutionText,
)
object ResolvePartialRefundRequest:
  given Encoder[ResolvePartialRefundRequest] = deriveEncoder
  given Decoder[ResolvePartialRefundRequest] = deriveDecoder

final case class OrderLineItem(
    menuItemId: MenuItemId,
    name: DisplayText,
    quantity: Quantity,
    unitPriceCents: CurrencyCents,
    refundedQuantity: Quantity,
)
object OrderLineItem:
  given Encoder[OrderLineItem] = deriveEncoder
  given Decoder[OrderLineItem] = Decoder.instance { cursor =>
    for
      menuItemId <- cursor.get[MenuItemId]("menuItemId")
      name <- cursor.get[DisplayText]("name")
      quantity <- cursor.get[Quantity]("quantity")
      unitPriceCents <- cursor.get[CurrencyCents]("unitPriceCents")
      refundedQuantity <- cursor.getOrElse[Quantity]("refundedQuantity")(NumericDefaults.ZeroQuantity)
    yield OrderLineItem(
      menuItemId = menuItemId,
      name = name,
      quantity = quantity,
      unitPriceCents = unitPriceCents,
      refundedQuantity = refundedQuantity,
    )
  }

final case class OrderTimelineEntry(status: OrderStatus, note: DisplayText, at: IsoDateTime)
object OrderTimelineEntry:
  given Encoder[OrderTimelineEntry] = deriveEncoder
  given Decoder[OrderTimelineEntry] = deriveDecoder

final case class OrderChatMessage(
    id: ChatMessageId,
    senderRole: UserRole,
    senderName: PersonName,
    body: DisplayText,
    sentAt: IsoDateTime,
)
object OrderChatMessage:
  given Encoder[OrderChatMessage] = deriveEncoder
  given Decoder[OrderChatMessage] = deriveDecoder

final case class OrderPartialRefundRequest(
    id: RefundRequestId,
    orderId: OrderId,
    menuItemId: MenuItemId,
    itemName: DisplayText,
    quantity: Quantity,
    reason: ReasonText,
    status: PartialRefundStatus,
    resolutionNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)
object OrderPartialRefundRequest:
  given Encoder[OrderPartialRefundRequest] = deriveEncoder
  given Decoder[OrderPartialRefundRequest] = deriveDecoder

final case class OrderSummary(
    id: OrderId,
    customerId: CustomerId,
    customerName: PersonName,
    storeId: StoreId,
    storeName: DisplayText,
    riderId: Option[RiderId],
    riderName: Option[PersonName],
    status: OrderStatus,
    deliveryAddress: AddressText,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    items: List[OrderLineItem],
    itemSubtotalCents: CurrencyCents,
    deliveryFeeCents: CurrencyCents,
    couponDiscountCents: CurrencyCents,
    appliedCoupon: Option[Coupon],
    totalPriceCents: CurrencyCents,
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
    storeRating: Option[RatingValue],
    riderRating: Option[RatingValue],
    reviewComment: Option[ReasonText],
    reviewExtraNote: Option[NoteText],
    storeReviewComment: Option[ReasonText],
    storeReviewExtraNote: Option[NoteText],
    riderReviewComment: Option[ReasonText],
    riderReviewExtraNote: Option[NoteText],
    merchantRejectReason: Option[ReasonText],
    reviewStatus: ReviewStatus,
    reviewRevokedReason: Option[ReasonText],
    reviewRevokedAt: Option[IsoDateTime],
    timeline: List[OrderTimelineEntry],
    chatMessages: List[OrderChatMessage],
    partialRefundRequests: List[OrderPartialRefundRequest],
)
object OrderSummary:
  given Encoder[OrderSummary] = Encoder.instance { order =>
    Json.obj(
      "id" -> Json.fromString(order.id.raw),
      "customerId" -> Json.fromString(order.customerId.raw),
      "customerName" -> Json.fromString(order.customerName.raw),
      "storeId" -> Json.fromString(order.storeId.raw),
      "storeName" -> Json.fromString(order.storeName.raw),
      "riderId" -> Encoder.encodeOption[RiderId].apply(order.riderId),
      "riderName" -> Encoder.encodeOption[PersonName].apply(order.riderName),
      "status" -> summon[Encoder[OrderStatus]].apply(order.status),
      "deliveryAddress" -> Json.fromString(order.deliveryAddress.raw),
      "scheduledDeliveryAt" -> Json.fromString(order.scheduledDeliveryAt.raw),
      "remark" -> Encoder.encodeOption[NoteText].apply(order.remark),
      "items" -> Encoder.encodeList[OrderLineItem].apply(order.items),
      "itemSubtotalCents" -> Json.fromInt(order.itemSubtotalCents),
      "deliveryFeeCents" -> Json.fromInt(order.deliveryFeeCents),
      "couponDiscountCents" -> Json.fromInt(order.couponDiscountCents),
      "appliedCoupon" -> Encoder.encodeOption[Coupon].apply(order.appliedCoupon),
      "totalPriceCents" -> Json.fromInt(order.totalPriceCents),
      "createdAt" -> Json.fromString(order.createdAt.raw),
      "updatedAt" -> Json.fromString(order.updatedAt.raw),
      "storeRating" -> Encoder.encodeOption[RatingValue].apply(order.storeRating),
      "riderRating" -> Encoder.encodeOption[RatingValue].apply(order.riderRating),
      "reviewComment" -> Encoder.encodeOption[ReasonText].apply(order.reviewComment),
      "reviewExtraNote" -> Encoder.encodeOption[NoteText].apply(order.reviewExtraNote),
      "storeReviewComment" -> Encoder.encodeOption[ReasonText].apply(order.storeReviewComment),
      "storeReviewExtraNote" -> Encoder.encodeOption[NoteText].apply(order.storeReviewExtraNote),
      "riderReviewComment" -> Encoder.encodeOption[ReasonText].apply(order.riderReviewComment),
      "riderReviewExtraNote" -> Encoder.encodeOption[NoteText].apply(order.riderReviewExtraNote),
      "merchantRejectReason" -> Encoder.encodeOption[ReasonText].apply(order.merchantRejectReason),
      "reviewStatus" -> summon[Encoder[ReviewStatus]].apply(order.reviewStatus),
      "reviewRevokedReason" -> Encoder.encodeOption[ReasonText].apply(order.reviewRevokedReason),
      "reviewRevokedAt" -> Encoder.encodeOption[IsoDateTime].apply(order.reviewRevokedAt),
      "timeline" -> Encoder.encodeList[OrderTimelineEntry].apply(order.timeline),
      "chatMessages" -> Encoder.encodeList[OrderChatMessage].apply(order.chatMessages),
      "partialRefundRequests" -> Encoder.encodeList[OrderPartialRefundRequest].apply(order.partialRefundRequests),
    )
  }
  given Decoder[OrderSummary] = Decoder.instance { cursor =>
    for
      id <- cursor.get[OrderId]("id")
      customerId <- cursor.get[CustomerId]("customerId")
      customerName <- cursor.get[PersonName]("customerName")
      storeId <- cursor.get[StoreId]("storeId")
      storeName <- cursor.get[DisplayText]("storeName")
      riderId <- cursor.get[Option[RiderId]]("riderId")
      riderName <- cursor.get[Option[PersonName]]("riderName")
      status <- cursor.get[OrderStatus]("status")
      deliveryAddress <- cursor.get[AddressText]("deliveryAddress")
      createdAt <- cursor.get[IsoDateTime]("createdAt")
      scheduledDeliveryAt <- cursor.getOrElse[IsoDateTime]("scheduledDeliveryAt")(createdAt)
      remark <- cursor.get[Option[NoteText]]("remark")
      items <- cursor.get[List[OrderLineItem]]("items")
      totalPriceCents <- cursor.get[CurrencyCents]("totalPriceCents")
      itemSubtotalCents <- cursor.getOrElse[CurrencyCents]("itemSubtotalCents")(totalPriceCents)
      deliveryFeeCents <- cursor.getOrElse[CurrencyCents]("deliveryFeeCents")(NumericDefaults.ZeroCurrencyCents)
      couponDiscountCents <- cursor.getOrElse[CurrencyCents]("couponDiscountCents")(NumericDefaults.ZeroCurrencyCents)
      appliedCoupon <- cursor.getOrElse[Option[Coupon]]("appliedCoupon")(None)
      updatedAt <- cursor.get[IsoDateTime]("updatedAt")
      storeRating <- cursor.get[Option[RatingValue]]("storeRating")
      riderRating <- cursor.get[Option[RatingValue]]("riderRating")
      reviewComment <- cursor.get[Option[ReasonText]]("reviewComment")
      reviewExtraNote <- cursor.get[Option[NoteText]]("reviewExtraNote")
      storeReviewComment <- cursor.get[Option[ReasonText]]("storeReviewComment")
      storeReviewExtraNote <- cursor.get[Option[NoteText]]("storeReviewExtraNote")
      riderReviewComment <- cursor.get[Option[ReasonText]]("riderReviewComment")
      riderReviewExtraNote <- cursor.get[Option[NoteText]]("riderReviewExtraNote")
      merchantRejectReason <- cursor.get[Option[ReasonText]]("merchantRejectReason")
      reviewStatus <- cursor.get[ReviewStatus]("reviewStatus")
      reviewRevokedReason <- cursor.get[Option[ReasonText]]("reviewRevokedReason")
      reviewRevokedAt <- cursor.get[Option[IsoDateTime]]("reviewRevokedAt")
      timeline <- cursor.get[List[OrderTimelineEntry]]("timeline")
      chatMessages <- cursor.getOrElse[List[OrderChatMessage]]("chatMessages")(List.empty)
      partialRefundRequests <- cursor.getOrElse[List[OrderPartialRefundRequest]]("partialRefundRequests")(List.empty)
    yield OrderSummary(
      id = id,
      customerId = customerId,
      customerName = customerName,
      storeId = storeId,
      storeName = storeName,
      riderId = riderId,
      riderName = riderName,
      status = status,
      deliveryAddress = deliveryAddress,
      scheduledDeliveryAt = scheduledDeliveryAt,
      remark = remark,
      items = items,
      itemSubtotalCents = itemSubtotalCents,
      deliveryFeeCents = deliveryFeeCents,
      couponDiscountCents = couponDiscountCents,
      appliedCoupon = appliedCoupon,
      totalPriceCents = totalPriceCents,
      createdAt = createdAt,
      updatedAt = updatedAt,
      storeRating = storeRating,
      riderRating = riderRating,
      reviewComment = reviewComment,
      reviewExtraNote = reviewExtraNote,
      storeReviewComment = storeReviewComment,
      storeReviewExtraNote = storeReviewExtraNote,
      riderReviewComment = riderReviewComment,
      riderReviewExtraNote = riderReviewExtraNote,
      merchantRejectReason = merchantRejectReason,
      reviewStatus = reviewStatus,
      reviewRevokedReason = reviewRevokedReason,
      reviewRevokedAt = reviewRevokedAt,
      timeline = timeline,
      chatMessages = chatMessages,
      partialRefundRequests = partialRefundRequests,
    )
  }
