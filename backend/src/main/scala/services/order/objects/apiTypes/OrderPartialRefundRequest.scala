package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given
import services.merchant.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class OrderPartialRefundResolution(
    status: PartialRefundStatus,
    resolutionNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)

final case class OrderPartialRefundRequest(
    id: RefundRequestId,
    orderId: OrderId,
    menuItemId: MenuItemId,
    itemName: DisplayText,
    quantity: Quantity,
    reason: ReasonText,
    resolution: OrderPartialRefundResolution,
)
object OrderPartialRefundRequest:
  given Encoder[OrderPartialRefundResolution] = deriveEncoder
  given Decoder[OrderPartialRefundResolution] = deriveDecoder

  extension (partialRefund: OrderPartialRefundRequest)
    def status: PartialRefundStatus = partialRefund.resolution.status
    def resolutionNote: Option[ResolutionText] = partialRefund.resolution.resolutionNote
    def submittedAt: IsoDateTime = partialRefund.resolution.submittedAt
    def reviewedAt: Option[IsoDateTime] = partialRefund.resolution.reviewedAt

  given Encoder[OrderPartialRefundRequest] = Encoder.instance(partialRefund =>
    deriveEncoder[OrderPartialRefundRequest]
      .apply(partialRefund)
      .deepMerge(deriveEncoder[OrderPartialRefundResolution].apply(partialRefund.resolution))
      .mapObject(_.remove("resolution"))
  )

  given Decoder[OrderPartialRefundRequest] = Decoder.instance { cursor =>
    for
      id <- cursor.get[RefundRequestId]("id")
      orderId <- cursor.get[OrderId]("orderId")
      menuItemId <- cursor.get[MenuItemId]("menuItemId")
      itemName <- cursor.get[DisplayText]("itemName")
      quantity <- cursor.get[Quantity]("quantity")
      reason <- cursor.get[ReasonText]("reason")
      status <- cursor.get[PartialRefundStatus]("status")
      resolutionNote <- cursor.get[Option[ResolutionText]]("resolutionNote")
      submittedAt <- cursor.get[IsoDateTime]("submittedAt")
      reviewedAt <- cursor.get[Option[IsoDateTime]]("reviewedAt")
    yield OrderPartialRefundRequest(
      id = id,
      orderId = orderId,
      menuItemId = menuItemId,
      itemName = itemName,
      quantity = quantity,
      reason = reason,
      resolution = OrderPartialRefundResolution(
        status = status,
        resolutionNote = resolutionNote,
        submittedAt = submittedAt,
        reviewedAt = reviewedAt,
      ),
    )
  }
