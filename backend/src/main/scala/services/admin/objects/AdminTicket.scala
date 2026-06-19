package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.order.objects.*
import services.auth.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import services.customer.objects.Coupon
import system.objects.*

final case class AdminTicket(
    identity: AdminTicketIdentity,
    submission: AdminTicketSubmission,
    resolution: AdminTicketResolution,
    lifecycle: AdminTicketLifecycle,
)
object AdminTicket:
  extension (ticket: AdminTicket)
    def id: TicketId = ticket.identity.id
    def orderId: OrderId = ticket.identity.orderId
    def kind: TicketKind = ticket.identity.kind
    def status: TicketStatus = ticket.identity.status
    def summary: SummaryText = ticket.identity.summary
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
    def updatedAt: IsoDateTime = ticket.lifecycle.updatedAt

  given Encoder[AdminTicket] = Encoder.instance(ticket =>
    deriveEncoder[AdminTicket]
      .apply(ticket)
      .deepMerge(deriveEncoder[AdminTicketIdentity].apply(ticket.identity))
      .deepMerge(deriveEncoder[AdminTicketSubmission].apply(ticket.submission))
      .deepMerge(deriveEncoder[AdminTicketResolution].apply(ticket.resolution))
      .deepMerge(deriveEncoder[AdminTicketLifecycle].apply(ticket.lifecycle))
      .mapObject(_.remove("identity").remove("submission").remove("resolution").remove("lifecycle"))
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
      identity = AdminTicketIdentity(
        id = id,
        orderId = orderId,
        kind = kind,
        status = status,
        summary = summary,
      ),
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
      lifecycle = AdminTicketLifecycle(updatedAt = updatedAt),
    )
  }
