package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ReviewAppealReview(
    status: AppealStatus,
    resolutionNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)

final case class ReviewAppeal(
    id: ReviewAppealId,
    orderId: OrderId,
    customerId: CustomerId,
    customerName: PersonName,
    storeId: StoreId,
    riderId: Option[RiderId],
    appellantRole: AppealRole,
    reason: ReasonText,
    review: ReviewAppealReview,
)
object ReviewAppeal:
  given Encoder[ReviewAppealReview] = deriveEncoder
  given Decoder[ReviewAppealReview] = deriveDecoder

  extension (appeal: ReviewAppeal)
    def status: AppealStatus = appeal.review.status
    def resolutionNote: Option[ResolutionText] = appeal.review.resolutionNote
    def submittedAt: IsoDateTime = appeal.review.submittedAt
    def reviewedAt: Option[IsoDateTime] = appeal.review.reviewedAt

  given Encoder[ReviewAppeal] = Encoder.instance(appeal =>
    deriveEncoder[ReviewAppeal]
      .apply(appeal)
      .deepMerge(deriveEncoder[ReviewAppealReview].apply(appeal.review))
      .mapObject(_.remove("review"))
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
      id = id,
      orderId = orderId,
      customerId = customerId,
      customerName = customerName,
      storeId = storeId,
      riderId = riderId,
      appellantRole = appellantRole,
      reason = reason,
      review = ReviewAppealReview(
        status = status,
        resolutionNote = resolutionNote,
        submittedAt = submittedAt,
        reviewedAt = reviewedAt,
      ),
    )
  }
