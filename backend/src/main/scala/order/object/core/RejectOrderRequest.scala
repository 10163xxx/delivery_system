package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class RejectOrderRequest(reason: ReasonText)
object RejectOrderRequest:
  given Encoder[RejectOrderRequest] = deriveEncoder
  given Decoder[RejectOrderRequest] = deriveDecoder
