package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class ReviewSubmission(
    rating: RatingValue,
    comment: Option[ReasonText],
    extraNote: Option[NoteText],
)
object ReviewSubmission:
  given Encoder[ReviewSubmission] = deriveEncoder
  given Decoder[ReviewSubmission] = deriveDecoder
