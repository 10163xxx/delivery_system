package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.order.objects.apiTypes.*
import services.rider.objects.*
import services.review.objects.*
import services.merchant.objects.*
import services.customer.objects.*

import io.circe.{Decoder, Encoder, Json}
import system.objects.*

final case class OrderSummary(
    identity: OrderSummaryIdentity,
    fulfillment: OrderSummaryFulfillment,
    pricing: OrderSummaryPricing,
    lifecycle: OrderSummaryLifecycle,
    reviewState: OrderSummaryReviewState,
    reviewContent: OrderSummaryReviewContent,
    activity: OrderSummaryActivity,
)
object OrderSummary:
  extension (order: OrderSummary)
    def id: OrderId = order.identity.id
    def customerId: CustomerId = order.identity.customerId
    def customerName: PersonName = order.identity.customerName
    def storeId: StoreId = order.identity.storeId
    def storeName: DisplayText = order.identity.storeName
    def riderId: Option[RiderId] = order.identity.riderId
    def riderName: Option[PersonName] = order.identity.riderName
    def status: OrderStatus = order.fulfillment.status
    def deliveryAddress: AddressText = order.fulfillment.deliveryAddress
    def scheduledDeliveryAt: IsoDateTime = order.fulfillment.scheduledDeliveryAt
    def remark: Option[NoteText] = order.fulfillment.remark
    def items: List[OrderLineItem] = order.fulfillment.items
    def itemSubtotalCents: CurrencyCents = order.pricing.itemSubtotalCents
    def deliveryFeeCents: CurrencyCents = order.pricing.deliveryFeeCents
    def couponDiscountCents: CurrencyCents = order.pricing.couponDiscountCents
    def appliedCoupon: Option[Coupon] = order.pricing.appliedCoupon
    def totalPriceCents: CurrencyCents = order.pricing.totalPriceCents
    def createdAt: IsoDateTime = order.lifecycle.createdAt
    def updatedAt: IsoDateTime = order.lifecycle.updatedAt
    def storeRating: Option[RatingValue] = order.reviewState.storeRating
    def riderRating: Option[RatingValue] = order.reviewState.riderRating
    def reviewComment: Option[ReasonText] = order.reviewContent.reviewComment
    def reviewExtraNote: Option[NoteText] = order.reviewContent.reviewExtraNote
    def storeReviewComment: Option[ReasonText] = order.reviewContent.storeReviewComment
    def storeReviewExtraNote: Option[NoteText] = order.reviewContent.storeReviewExtraNote
    def storeMerchantReply: Option[NoteText] = order.reviewContent.storeMerchantReply
    def storeMerchantReplyAt: Option[IsoDateTime] = order.reviewContent.storeMerchantReplyAt
    def riderReviewComment: Option[ReasonText] = order.reviewContent.riderReviewComment
    def riderReviewExtraNote: Option[NoteText] = order.reviewContent.riderReviewExtraNote
    def merchantRejectReason: Option[ReasonText] = order.reviewState.merchantRejectReason
    def reviewStatus: ReviewStatus = order.reviewState.reviewStatus
    def reviewRevokedReason: Option[ReasonText] = order.reviewState.reviewRevokedReason
    def reviewRevokedAt: Option[IsoDateTime] = order.reviewState.reviewRevokedAt
    def timeline: List[OrderTimelineEntry] = order.activity.timeline
    def chatMessages: List[OrderChatMessage] = order.activity.chatMessages
    def partialRefundRequests: List[OrderPartialRefundRequest] = order.activity.partialRefundRequests

  given Encoder[OrderSummary] = Encoder.instance { order =>
    Json.obj(
      "id" -> Json.fromString(order.identity.id.raw),
      "customerId" -> Json.fromString(order.identity.customerId.raw),
      "customerName" -> Json.fromString(order.identity.customerName.raw),
      "storeId" -> Json.fromString(order.identity.storeId.raw),
      "storeName" -> Json.fromString(order.identity.storeName.raw),
      "riderId" -> Encoder.encodeOption[RiderId].apply(order.identity.riderId),
      "riderName" -> Encoder.encodeOption[PersonName].apply(order.identity.riderName),
      "status" -> summon[Encoder[OrderStatus]].apply(order.fulfillment.status),
      "deliveryAddress" -> Json.fromString(order.fulfillment.deliveryAddress.raw),
      "scheduledDeliveryAt" -> Json.fromString(order.fulfillment.scheduledDeliveryAt.raw),
      "remark" -> Encoder.encodeOption[NoteText].apply(order.fulfillment.remark),
      "items" -> Encoder.encodeList[OrderLineItem].apply(order.fulfillment.items),
      "itemSubtotalCents" -> Json.fromInt(order.pricing.itemSubtotalCents),
      "deliveryFeeCents" -> Json.fromInt(order.pricing.deliveryFeeCents),
      "couponDiscountCents" -> Json.fromInt(order.pricing.couponDiscountCents),
      "appliedCoupon" -> Encoder.encodeOption[Coupon].apply(order.pricing.appliedCoupon),
      "totalPriceCents" -> Json.fromInt(order.pricing.totalPriceCents),
      "createdAt" -> Json.fromString(order.lifecycle.createdAt.raw),
      "updatedAt" -> Json.fromString(order.lifecycle.updatedAt.raw),
      "storeRating" -> Encoder.encodeOption[RatingValue].apply(order.reviewState.storeRating),
      "riderRating" -> Encoder.encodeOption[RatingValue].apply(order.reviewState.riderRating),
      "reviewComment" -> Encoder.encodeOption[ReasonText].apply(order.reviewContent.reviewComment),
      "reviewExtraNote" -> Encoder.encodeOption[NoteText].apply(order.reviewContent.reviewExtraNote),
      "storeReviewComment" -> Encoder.encodeOption[ReasonText].apply(order.reviewContent.storeReviewComment),
      "storeReviewExtraNote" -> Encoder.encodeOption[NoteText].apply(order.reviewContent.storeReviewExtraNote),
      "storeMerchantReply" -> Encoder.encodeOption[NoteText].apply(order.reviewContent.storeMerchantReply),
      "storeMerchantReplyAt" -> Encoder.encodeOption[IsoDateTime].apply(order.reviewContent.storeMerchantReplyAt),
      "riderReviewComment" -> Encoder.encodeOption[ReasonText].apply(order.reviewContent.riderReviewComment),
      "riderReviewExtraNote" -> Encoder.encodeOption[NoteText].apply(order.reviewContent.riderReviewExtraNote),
      "merchantRejectReason" -> Encoder.encodeOption[ReasonText].apply(order.reviewState.merchantRejectReason),
      "reviewStatus" -> summon[Encoder[ReviewStatus]].apply(order.reviewState.reviewStatus),
      "reviewRevokedReason" -> Encoder.encodeOption[ReasonText].apply(order.reviewState.reviewRevokedReason),
      "reviewRevokedAt" -> Encoder.encodeOption[IsoDateTime].apply(order.reviewState.reviewRevokedAt),
      "timeline" -> Encoder.encodeList[OrderTimelineEntry].apply(order.activity.timeline),
      "chatMessages" -> Encoder.encodeList[OrderChatMessage].apply(order.activity.chatMessages),
      "partialRefundRequests" -> Encoder.encodeList[OrderPartialRefundRequest].apply(order.activity.partialRefundRequests),
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
      storeMerchantReply <- cursor.getOrElse[Option[NoteText]]("storeMerchantReply")(None)
      storeMerchantReplyAt <- cursor.getOrElse[Option[IsoDateTime]]("storeMerchantReplyAt")(None)
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
      identity = OrderSummaryIdentity(
        id = id,
        customerId = customerId,
        customerName = customerName,
        storeId = storeId,
        storeName = storeName,
        riderId = riderId,
        riderName = riderName,
      ),
      fulfillment = OrderSummaryFulfillment(
        status = status,
        deliveryAddress = deliveryAddress,
        scheduledDeliveryAt = scheduledDeliveryAt,
        remark = remark,
        items = items,
      ),
      pricing = OrderSummaryPricing(
        itemSubtotalCents = itemSubtotalCents,
        deliveryFeeCents = deliveryFeeCents,
        couponDiscountCents = couponDiscountCents,
        appliedCoupon = appliedCoupon,
        totalPriceCents = totalPriceCents,
      ),
      lifecycle = OrderSummaryLifecycle(
        createdAt = createdAt,
        updatedAt = updatedAt,
      ),
      reviewState = OrderSummaryReviewState(
        storeRating = storeRating,
        riderRating = riderRating,
        merchantRejectReason = merchantRejectReason,
        reviewStatus = reviewStatus,
        reviewRevokedReason = reviewRevokedReason,
        reviewRevokedAt = reviewRevokedAt,
      ),
      reviewContent = OrderSummaryReviewContent(
        reviewComment = reviewComment,
        reviewExtraNote = reviewExtraNote,
        storeReviewComment = storeReviewComment,
        storeReviewExtraNote = storeReviewExtraNote,
        storeMerchantReply = storeMerchantReply,
        storeMerchantReplyAt = storeMerchantReplyAt,
        riderReviewComment = riderReviewComment,
        riderReviewExtraNote = riderReviewExtraNote,
      ),
      activity = OrderSummaryActivity(
        timeline = timeline,
        chatMessages = chatMessages,
        partialRefundRequests = partialRefundRequests,
      ),
    )
  }
