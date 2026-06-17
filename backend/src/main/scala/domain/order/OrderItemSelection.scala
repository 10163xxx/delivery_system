package domain.order

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class OrderItemSelection(
    groupName: DisplayText,
    selectedOptions: List[DisplayText],
)
object OrderItemSelection:
  given Encoder[OrderItemSelection] = deriveEncoder
  given Decoder[OrderItemSelection] = deriveDecoder
