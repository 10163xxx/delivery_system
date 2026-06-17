package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ReviewAppeal(
    identity: ReviewAppealIdentity,
    decision: ReviewAppealDecision,
    review: ReviewAppealReview,
)
object ReviewAppeal:
  extension (appeal: ReviewAppeal)
    def id: ReviewAppealId = appeal.identity.id
    def orderId: OrderId = appeal.identity.orderId
    def customerId: CustomerId = appeal.identity.customerId
    def customerName: PersonName = appeal.identity.customerName
    def storeId: StoreId = appeal.identity.storeId
    def riderId: Option[RiderId] = appeal.identity.riderId
    def appellantRole: AppealRole = appeal.decision.appellantRole
    def reason: ReasonText = appeal.decision.reason
    def status: AppealStatus = appeal.review.status
    def resolutionNote: Option[ResolutionText] = appeal.review.resolutionNote
    def submittedAt: IsoDateTime = appeal.review.submittedAt
    def reviewedAt: Option[IsoDateTime] = appeal.review.reviewedAt

  given Encoder[ReviewAppeal] = Encoder.instance(appeal =>
    deriveEncoder[ReviewAppeal]
      .apply(appeal)
      .deepMerge(deriveEncoder[ReviewAppealIdentity].apply(appeal.identity))
      .deepMerge(deriveEncoder[ReviewAppealDecision].apply(appeal.decision))
      .deepMerge(deriveEncoder[ReviewAppealReview].apply(appeal.review))
      .mapObject(_.remove("identity").remove("decision").remove("review"))
  )

  given Decoder[ReviewAppeal] = Decoder.instance { cursor =>
    for
      id <- cursor.get[ReviewAppealId]("id")
      orderId <- cursor.get[OrderId]("orderId")
      customerId <- cursor.get[CustomerId]("customerId")
      customerName <- cursor.get[PersonName]("customerName")
      storeId <- cursor.get[StoreId]("storeId")
      riderId <- cursor.get[Option[RiderId]]("riderId")
      appellantRole <- cursor.get[AppealRole]("appellantRole")
      reason <- cursor.get[ReasonText]("reason")
      status <- cursor.get[AppealStatus]("status")
      resolutionNote <- cursor.get[Option[ResolutionText]]("resolutionNote")
      submittedAt <- cursor.get[IsoDateTime]("submittedAt")
      reviewedAt <- cursor.get[Option[IsoDateTime]]("reviewedAt")
    yield ReviewAppeal(
      identity = ReviewAppealIdentity(
        id = id,
        orderId = orderId,
        customerId = customerId,
        customerName = customerName,
        storeId = storeId,
        riderId = riderId,
      ),
      decision = ReviewAppealDecision(
        appellantRole = appellantRole,
        reason = reason,
      ),
      review = ReviewAppealReview(
        status = status,
        resolutionNote = resolutionNote,
        submittedAt = submittedAt,
        reviewedAt = reviewedAt,
      ),
    )
  }
