package domain.order

import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.semiauto.*
import domain.customer.Coupon
import domain.shared.*

final case class OrderItemInput(menuItemId: String, quantity: Int)
object OrderItemInput:
  given Encoder[OrderItemInput] = deriveEncoder
  given Decoder[OrderItemInput] = deriveDecoder

final case class CreateOrderRequest(
    customerId: String,
    storeId: String,
    deliveryAddress: String,
    scheduledDeliveryAt: String,
    remark: Option[String],
    couponId: Option[String],
    items: List[OrderItemInput],
)
object CreateOrderRequest:
  given Encoder[CreateOrderRequest] = deriveEncoder
  given Decoder[CreateOrderRequest] = deriveDecoder

final case class AssignRiderRequest(riderId: String)
object AssignRiderRequest:
  given Encoder[AssignRiderRequest] = deriveEncoder
  given Decoder[AssignRiderRequest] = deriveDecoder

final case class RejectOrderRequest(reason: String)
object RejectOrderRequest:
  given Encoder[RejectOrderRequest] = deriveEncoder
  given Decoder[RejectOrderRequest] = deriveDecoder

final case class ResolveAfterSalesRequest(
    approved: Boolean,
    resolutionNote: String,
    resolutionMode: Option[AfterSalesResolutionMode],
    actualCompensationCents: Option[Int],
    couponMinimumSpendCents: Option[Int],
)
object ResolveAfterSalesRequest:
  given Encoder[ResolveAfterSalesRequest] = deriveEncoder
  given Decoder[ResolveAfterSalesRequest] = deriveDecoder

final case class SubmitAfterSalesRequest(
    requestType: AfterSalesRequestType,
    reason: String,
    expectedCompensationCents: Option[Int],
)
object SubmitAfterSalesRequest:
  given Encoder[SubmitAfterSalesRequest] = deriveEncoder
  given Decoder[SubmitAfterSalesRequest] = deriveDecoder

final case class SendOrderChatMessageRequest(body: String)
object SendOrderChatMessageRequest:
  given Encoder[SendOrderChatMessageRequest] = deriveEncoder
  given Decoder[SendOrderChatMessageRequest] = deriveDecoder

final case class SubmitPartialRefundRequest(
    menuItemId: String,
    quantity: Int,
    reason: String,
)
object SubmitPartialRefundRequest:
  given Encoder[SubmitPartialRefundRequest] = deriveEncoder
  given Decoder[SubmitPartialRefundRequest] = deriveDecoder

final case class ResolvePartialRefundRequest(
    approved: Boolean,
    resolutionNote: String,
)
object ResolvePartialRefundRequest:
  given Encoder[ResolvePartialRefundRequest] = deriveEncoder
  given Decoder[ResolvePartialRefundRequest] = deriveDecoder

final case class OrderLineItem(
    menuItemId: String,
    name: String,
    quantity: Int,
    unitPriceCents: Int,
    refundedQuantity: Int,
)
object OrderLineItem:
  given Encoder[OrderLineItem] = deriveEncoder
  given Decoder[OrderLineItem] = Decoder.instance { cursor =>
    for
      menuItemId <- cursor.get[String]("menuItemId")
      name <- cursor.get[String]("name")
      quantity <- cursor.get[Int]("quantity")
      unitPriceCents <- cursor.get[Int]("unitPriceCents")
      refundedQuantity <- cursor.getOrElse[Int]("refundedQuantity")(0)
    yield OrderLineItem(
      menuItemId = menuItemId,
      name = name,
      quantity = quantity,
      unitPriceCents = unitPriceCents,
      refundedQuantity = refundedQuantity,
    )
  }

final case class OrderTimelineEntry(status: OrderStatus, note: String, at: String)
object OrderTimelineEntry:
  given Encoder[OrderTimelineEntry] = deriveEncoder
  given Decoder[OrderTimelineEntry] = deriveDecoder

final case class OrderChatMessage(
    id: String,
    senderRole: UserRole,
    senderName: String,
    body: String,
    sentAt: String,
)
object OrderChatMessage:
  given Encoder[OrderChatMessage] = deriveEncoder
  given Decoder[OrderChatMessage] = deriveDecoder

final case class OrderPartialRefundRequest(
    id: String,
    orderId: String,
    menuItemId: String,
    itemName: String,
    quantity: Int,
    reason: String,
    status: PartialRefundStatus,
    resolutionNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
)
object OrderPartialRefundRequest:
  given Encoder[OrderPartialRefundRequest] = deriveEncoder
  given Decoder[OrderPartialRefundRequest] = deriveDecoder

final case class OrderSummary(
    id: String,
    customerId: String,
    customerName: String,
    storeId: String,
    storeName: String,
    riderId: Option[String],
    riderName: Option[String],
    status: OrderStatus,
    deliveryAddress: String,
    scheduledDeliveryAt: String,
    remark: Option[String],
    items: List[OrderLineItem],
    itemSubtotalCents: Int,
    deliveryFeeCents: Int,
    couponDiscountCents: Int,
    appliedCoupon: Option[Coupon],
    totalPriceCents: Int,
    createdAt: String,
    updatedAt: String,
    storeRating: Option[Int],
    riderRating: Option[Int],
    reviewComment: Option[String],
    reviewExtraNote: Option[String],
    storeReviewComment: Option[String],
    storeReviewExtraNote: Option[String],
    riderReviewComment: Option[String],
    riderReviewExtraNote: Option[String],
    merchantRejectReason: Option[String],
    reviewStatus: ReviewStatus,
    reviewRevokedReason: Option[String],
    reviewRevokedAt: Option[String],
    timeline: List[OrderTimelineEntry],
    chatMessages: List[OrderChatMessage],
    partialRefundRequests: List[OrderPartialRefundRequest],
)
object OrderSummary:
  given Encoder[OrderSummary] = Encoder.instance { order =>
    Json.obj(
      "id" -> Json.fromString(order.id),
      "customerId" -> Json.fromString(order.customerId),
      "customerName" -> Json.fromString(order.customerName),
      "storeId" -> Json.fromString(order.storeId),
      "storeName" -> Json.fromString(order.storeName),
      "riderId" -> Encoder.encodeOption[String].apply(order.riderId),
      "riderName" -> Encoder.encodeOption[String].apply(order.riderName),
      "status" -> summon[Encoder[OrderStatus]].apply(order.status),
      "deliveryAddress" -> Json.fromString(order.deliveryAddress),
      "scheduledDeliveryAt" -> Json.fromString(order.scheduledDeliveryAt),
      "remark" -> Encoder.encodeOption[String].apply(order.remark),
      "items" -> Encoder.encodeList[OrderLineItem].apply(order.items),
      "itemSubtotalCents" -> Json.fromInt(order.itemSubtotalCents),
      "deliveryFeeCents" -> Json.fromInt(order.deliveryFeeCents),
      "couponDiscountCents" -> Json.fromInt(order.couponDiscountCents),
      "appliedCoupon" -> Encoder.encodeOption[Coupon].apply(order.appliedCoupon),
      "totalPriceCents" -> Json.fromInt(order.totalPriceCents),
      "createdAt" -> Json.fromString(order.createdAt),
      "updatedAt" -> Json.fromString(order.updatedAt),
      "storeRating" -> Encoder.encodeOption[Int].apply(order.storeRating),
      "riderRating" -> Encoder.encodeOption[Int].apply(order.riderRating),
      "reviewComment" -> Encoder.encodeOption[String].apply(order.reviewComment),
      "reviewExtraNote" -> Encoder.encodeOption[String].apply(order.reviewExtraNote),
      "storeReviewComment" -> Encoder.encodeOption[String].apply(order.storeReviewComment),
      "storeReviewExtraNote" -> Encoder.encodeOption[String].apply(order.storeReviewExtraNote),
      "riderReviewComment" -> Encoder.encodeOption[String].apply(order.riderReviewComment),
      "riderReviewExtraNote" -> Encoder.encodeOption[String].apply(order.riderReviewExtraNote),
      "merchantRejectReason" -> Encoder.encodeOption[String].apply(order.merchantRejectReason),
      "reviewStatus" -> summon[Encoder[ReviewStatus]].apply(order.reviewStatus),
      "reviewRevokedReason" -> Encoder.encodeOption[String].apply(order.reviewRevokedReason),
      "reviewRevokedAt" -> Encoder.encodeOption[String].apply(order.reviewRevokedAt),
      "timeline" -> Encoder.encodeList[OrderTimelineEntry].apply(order.timeline),
      "chatMessages" -> Encoder.encodeList[OrderChatMessage].apply(order.chatMessages),
      "partialRefundRequests" -> Encoder.encodeList[OrderPartialRefundRequest].apply(order.partialRefundRequests),
    )
  }
  given Decoder[OrderSummary] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      customerId <- cursor.get[String]("customerId")
      customerName <- cursor.get[String]("customerName")
      storeId <- cursor.get[String]("storeId")
      storeName <- cursor.get[String]("storeName")
      riderId <- cursor.get[Option[String]]("riderId")
      riderName <- cursor.get[Option[String]]("riderName")
      status <- cursor.get[OrderStatus]("status")
      deliveryAddress <- cursor.get[String]("deliveryAddress")
      createdAt <- cursor.get[String]("createdAt")
      scheduledDeliveryAt <- cursor.getOrElse[String]("scheduledDeliveryAt")(createdAt)
      remark <- cursor.get[Option[String]]("remark")
      items <- cursor.get[List[OrderLineItem]]("items")
      totalPriceCents <- cursor.get[Int]("totalPriceCents")
      itemSubtotalCents <- cursor.getOrElse[Int]("itemSubtotalCents")(totalPriceCents)
      deliveryFeeCents <- cursor.getOrElse[Int]("deliveryFeeCents")(0)
      couponDiscountCents <- cursor.getOrElse[Int]("couponDiscountCents")(0)
      appliedCoupon <- cursor.getOrElse[Option[Coupon]]("appliedCoupon")(None)
      updatedAt <- cursor.get[String]("updatedAt")
      storeRating <- cursor.get[Option[Int]]("storeRating")
      riderRating <- cursor.get[Option[Int]]("riderRating")
      reviewComment <- cursor.get[Option[String]]("reviewComment")
      reviewExtraNote <- cursor.get[Option[String]]("reviewExtraNote")
      storeReviewComment <- cursor.get[Option[String]]("storeReviewComment")
      storeReviewExtraNote <- cursor.get[Option[String]]("storeReviewExtraNote")
      riderReviewComment <- cursor.get[Option[String]]("riderReviewComment")
      riderReviewExtraNote <- cursor.get[Option[String]]("riderReviewExtraNote")
      merchantRejectReason <- cursor.get[Option[String]]("merchantRejectReason")
      reviewStatus <- cursor.get[ReviewStatus]("reviewStatus")
      reviewRevokedReason <- cursor.get[Option[String]]("reviewRevokedReason")
      reviewRevokedAt <- cursor.get[Option[String]]("reviewRevokedAt")
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
