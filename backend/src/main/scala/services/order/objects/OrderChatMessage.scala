package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.auth.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

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
