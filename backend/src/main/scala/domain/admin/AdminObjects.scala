package domain.admin

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.customer.Coupon
import domain.shared.*

final case class AdminProfile(id: String, name: String)
object AdminProfile:
  given Encoder[AdminProfile] = deriveEncoder
  given Decoder[AdminProfile] = deriveDecoder

final case class AdminTicket(
    id: String,
    orderId: String,
    kind: TicketKind,
    status: TicketStatus,
    summary: String,
    requestType: Option[AfterSalesRequestType],
    submittedByRole: Option[UserRole],
    submittedByName: Option[String],
    expectedCompensationCents: Option[Int],
    actualCompensationCents: Option[Int],
    approved: Option[Boolean],
    resolutionMode: Option[AfterSalesResolutionMode],
    issuedCoupon: Option[Coupon],
    submittedAt: String,
    reviewedAt: Option[String],
    resolutionNote: Option[String],
    updatedAt: String,
)
object AdminTicket:
  given Encoder[AdminTicket] = deriveEncoder
  given Decoder[AdminTicket] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      orderId <- cursor.get[String]("orderId")
      kind <- cursor.get[TicketKind]("kind")
      status <- cursor.get[TicketStatus]("status")
      summary <- cursor.get[String]("summary")
      requestType <- cursor.getOrElse[Option[AfterSalesRequestType]]("requestType")(None)
      submittedByRole <- cursor.getOrElse[Option[UserRole]]("submittedByRole")(None)
      submittedByName <- cursor.getOrElse[Option[String]]("submittedByName")(None)
      expectedCompensationCents <- cursor.getOrElse[Option[Int]]("expectedCompensationCents")(None)
      actualCompensationCents <- cursor.getOrElse[Option[Int]]("actualCompensationCents")(None)
      approved <- cursor.getOrElse[Option[Boolean]]("approved")(None)
      resolutionMode <- cursor.getOrElse[Option[AfterSalesResolutionMode]]("resolutionMode")(None)
      issuedCoupon <- cursor.getOrElse[Option[Coupon]]("issuedCoupon")(None)
      updatedAt <- cursor.get[String]("updatedAt")
      submittedAt <- cursor.getOrElse[String]("submittedAt")(updatedAt)
      reviewedAt <- cursor.getOrElse[Option[String]]("reviewedAt")(None)
      resolutionNote <- cursor.get[Option[String]]("resolutionNote")
    yield AdminTicket(
      id = id,
      orderId = orderId,
      kind = kind,
      status = status,
      summary = summary,
      requestType = requestType,
      submittedByRole = submittedByRole,
      submittedByName = submittedByName,
      expectedCompensationCents = expectedCompensationCents,
      actualCompensationCents = actualCompensationCents,
      approved = approved,
      resolutionMode = resolutionMode,
      issuedCoupon = issuedCoupon,
      submittedAt = submittedAt,
      reviewedAt = reviewedAt,
      resolutionNote = resolutionNote,
      updatedAt = updatedAt,
    )
  }

final case class ResolveTicketRequest(resolution: String, note: String)
object ResolveTicketRequest:
  given Encoder[ResolveTicketRequest] = deriveEncoder
  given Decoder[ResolveTicketRequest] = deriveDecoder
