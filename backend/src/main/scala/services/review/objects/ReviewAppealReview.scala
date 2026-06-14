package domain.review

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ReviewAppealReview(
    status: AppealStatus,
    resolutionNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)
object ReviewAppealReview:
  given Encoder[ReviewAppealReview] = deriveEncoder
  given Decoder[ReviewAppealReview] = deriveDecoder
