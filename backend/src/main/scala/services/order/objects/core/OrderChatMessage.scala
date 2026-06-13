package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class OrderChatMessage(
    id: ChatMessageId,
    senderRole: UserRole,
    senderName: PersonName,
    body: DisplayText,
    sentAt: IsoDateTime,
)
object OrderChatMessage:
  given Encoder[OrderChatMessage] = deriveEncoder
  given Decoder[OrderChatMessage] = deriveDecoder
