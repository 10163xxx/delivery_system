package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ReviewSubmission(
    rating: RatingValue,
    comment: Option[ReasonText],
    extraNote: Option[NoteText],
)
object ReviewSubmission:
  given Encoder[ReviewSubmission] = deriveEncoder
  given Decoder[ReviewSubmission] = deriveDecoder
