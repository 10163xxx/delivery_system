package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
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
