package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MenuItemSelectionOption(
    name: DisplayText,
    additionalPriceCents: CurrencyCents,
)
object MenuItemSelectionOption:
  given Encoder[MenuItemSelectionOption] = deriveEncoder
  given Decoder[MenuItemSelectionOption] = deriveDecoder
