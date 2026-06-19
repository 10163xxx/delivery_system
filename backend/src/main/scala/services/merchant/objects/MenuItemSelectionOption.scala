package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MenuItemSelectionOption(
    name: DisplayText,
    additionalPriceCents: CurrencyCents,
)
object MenuItemSelectionOption:
  given Encoder[MenuItemSelectionOption] = deriveEncoder
  given Decoder[MenuItemSelectionOption] = deriveDecoder
