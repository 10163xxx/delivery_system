package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class OrderItemSelection(
    groupName: DisplayText,
    selectedOptions: List[DisplayText],
)
object OrderItemSelection:
  given Encoder[OrderItemSelection] = deriveEncoder
  given Decoder[OrderItemSelection] = deriveDecoder
