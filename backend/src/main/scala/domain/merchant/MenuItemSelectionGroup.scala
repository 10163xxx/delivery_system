package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MenuItemSelectionGroup(
    name: DisplayText,
    minSelections: EntityCount,
    maxSelections: EntityCount,
    options: List[MenuItemSelectionOption],
)
object MenuItemSelectionGroup:
  given Encoder[MenuItemSelectionGroup] = deriveEncoder
  given Decoder[MenuItemSelectionGroup] = deriveDecoder
