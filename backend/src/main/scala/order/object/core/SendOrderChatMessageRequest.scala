package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class SendOrderChatMessageRequest(body: DisplayText)
object SendOrderChatMessageRequest:
  given Encoder[SendOrderChatMessageRequest] = deriveEncoder
  given Decoder[SendOrderChatMessageRequest] = deriveDecoder
