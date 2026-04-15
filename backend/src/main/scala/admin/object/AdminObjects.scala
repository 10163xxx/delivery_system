package domain.admin

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.customer.Coupon
import domain.shared.*

final case class AdminProfile(
    id: AdminId,
    name: PersonName,
    platformIncomeCents: CurrencyCents,
)
object AdminProfile:
  given Encoder[AdminProfile] = deriveEncoder
  given Decoder[AdminProfile] = Decoder.instance { cursor =>
    for
      id <- cursor.get[AdminId]("id")
      name <- cursor.get[PersonName]("name")
      platformIncomeCents <- cursor.getOrElse[CurrencyCents]("platformIncomeCents")(NumericDefaults.ZeroCurrencyCents)
    yield AdminProfile(
      id = id,
      name = name,
      platformIncomeCents = platformIncomeCents,
    )
  }

final case class AdminTicket(
    id: TicketId,
    orderId: OrderId,
    kind: TicketKind,
    status: TicketStatus,
    summary: SummaryText,
    requestType: Option[AfterSalesRequestType],
    submittedByRole: Option[UserRole],
    submittedByName: Option[PersonName],
    expectedCompensationCents: Option[CurrencyCents],
    actualCompensationCents: Option[CurrencyCents],
    approved: Option[ApprovalFlag],
    resolutionMode: Option[AfterSalesResolutionMode],
    issuedCoupon: Option[Coupon],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
    resolutionNote: Option[ResolutionText],
    updatedAt: IsoDateTime,
)
object AdminTicket:
  given Encoder[AdminTicket] = deriveEncoder
  given Decoder[AdminTicket] = Decoder.instance { cursor =>
    for
      id <- cursor.get[TicketId]("id")
      orderId <- cursor.get[OrderId]("orderId")
      kind <- cursor.get[TicketKind]("kind")
      status <- cursor.get[TicketStatus]("status")
      summary <- cursor.get[SummaryText]("summary")
      requestType <- cursor.getOrElse[Option[AfterSalesRequestType]]("requestType")(None)
      submittedByRole <- cursor.getOrElse[Option[UserRole]]("submittedByRole")(None)
      submittedByName <- cursor.getOrElse[Option[PersonName]]("submittedByName")(None)
      expectedCompensationCents <- cursor.getOrElse[Option[CurrencyCents]]("expectedCompensationCents")(None)
      actualCompensationCents <- cursor.getOrElse[Option[CurrencyCents]]("actualCompensationCents")(None)
      approved <- cursor.getOrElse[Option[ApprovalFlag]]("approved")(None)
      resolutionMode <- cursor.getOrElse[Option[AfterSalesResolutionMode]]("resolutionMode")(None)
      issuedCoupon <- cursor.getOrElse[Option[Coupon]]("issuedCoupon")(None)
      updatedAt <- cursor.get[IsoDateTime]("updatedAt")
      submittedAt <- cursor.getOrElse[IsoDateTime]("submittedAt")(updatedAt)
      reviewedAt <- cursor.getOrElse[Option[IsoDateTime]]("reviewedAt")(None)
      resolutionNote <- cursor.get[Option[ResolutionText]]("resolutionNote")
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

final case class ResolveTicketRequest(resolution: ResolutionText, note: NoteText)
object ResolveTicketRequest:
  given Encoder[ResolveTicketRequest] = deriveEncoder
  given Decoder[ResolveTicketRequest] = deriveDecoder
