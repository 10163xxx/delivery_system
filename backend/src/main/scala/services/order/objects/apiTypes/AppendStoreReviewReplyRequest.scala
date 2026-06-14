package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AppendStoreReviewReplyRequest(
    reply: NoteText,
)
object AppendStoreReviewReplyRequest:
  given Encoder[AppendStoreReviewReplyRequest] = deriveEncoder
  given Decoder[AppendStoreReviewReplyRequest] = deriveDecoder
