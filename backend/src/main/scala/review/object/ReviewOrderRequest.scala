package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ReviewOrderRequest(
    storeReview: Option[ReviewSubmission],
    riderReview: Option[ReviewSubmission],
)
object ReviewOrderRequest:
  given Encoder[ReviewOrderRequest] = deriveEncoder
  given Decoder[ReviewOrderRequest] = deriveDecoder
