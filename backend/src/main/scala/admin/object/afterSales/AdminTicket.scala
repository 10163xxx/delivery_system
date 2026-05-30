package domain.admin

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.customer.Coupon
import domain.shared.*

final case class AdminTicketSubmission(
    requestType: Option[AfterSalesRequestType],
    submittedByRole: Option[UserRole],
    submittedByName: Option[PersonName],
    expectedCompensationCents: Option[CurrencyCents],
    submittedAt: IsoDateTime,
)

final case class AdminTicketResolution(
    actualCompensationCents: Option[CurrencyCents],
    approved: Option[ApprovalFlag],
    resolutionMode: Option[AfterSalesResolutionMode],
    issuedCoupon: Option[Coupon],
    reviewedAt: Option[IsoDateTime],
    resolutionNote: Option[ResolutionText],
)

final case class AdminTicket(
    id: TicketId,
    orderId: OrderId,
    kind: TicketKind,
    status: TicketStatus,
    summary: SummaryText,
    submission: AdminTicketSubmission,
    resolution: AdminTicketResolution,
    updatedAt: IsoDateTime,
)
object AdminTicket:
  given Encoder[AdminTicketSubmission] = deriveEncoder
  given Decoder[AdminTicketSubmission] = deriveDecoder
  given Encoder[AdminTicketResolution] = deriveEncoder
  given Decoder[AdminTicketResolution] = deriveDecoder

  def apply(
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
  ): AdminTicket =
    new AdminTicket(
      id = id,
      orderId = orderId,
      kind = kind,
      status = status,
      summary = summary,
      submission = AdminTicketSubmission(
        requestType = requestType,
        submittedByRole = submittedByRole,
        submittedByName = submittedByName,
        expectedCompensationCents = expectedCompensationCents,
        submittedAt = submittedAt,
      ),
      resolution = AdminTicketResolution(
        actualCompensationCents = actualCompensationCents,
        approved = approved,
        resolutionMode = resolutionMode,
        issuedCoupon = issuedCoupon,
        reviewedAt = reviewedAt,
        resolutionNote = resolutionNote,
      ),
      updatedAt = updatedAt,
    )

  extension (ticket: AdminTicket)
    def requestType: Option[AfterSalesRequestType] = ticket.submission.requestType
    def submittedByRole: Option[UserRole] = ticket.submission.submittedByRole
    def submittedByName: Option[PersonName] = ticket.submission.submittedByName
    def expectedCompensationCents: Option[CurrencyCents] = ticket.submission.expectedCompensationCents
    def submittedAt: IsoDateTime = ticket.submission.submittedAt
    def actualCompensationCents: Option[CurrencyCents] = ticket.resolution.actualCompensationCents
    def approved: Option[ApprovalFlag] = ticket.resolution.approved
    def resolutionMode: Option[AfterSalesResolutionMode] = ticket.resolution.resolutionMode
    def issuedCoupon: Option[Coupon] = ticket.resolution.issuedCoupon
    def reviewedAt: Option[IsoDateTime] = ticket.resolution.reviewedAt
    def resolutionNote: Option[ResolutionText] = ticket.resolution.resolutionNote

  given Encoder[AdminTicket] = Encoder.instance(ticket =>
    deriveEncoder[AdminTicket]
      .apply(ticket)
      .deepMerge(deriveEncoder[AdminTicketSubmission].apply(ticket.submission))
      .deepMerge(deriveEncoder[AdminTicketResolution].apply(ticket.resolution))
      .mapObject(_.remove("submission").remove("resolution"))
  )
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
