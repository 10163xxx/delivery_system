package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateMenuItemPriceRequest(
    priceCents: CurrencyCents,
)
object UpdateMenuItemPriceRequest:
  given Encoder[UpdateMenuItemPriceRequest] = deriveEncoder
  given Decoder[UpdateMenuItemPriceRequest] = deriveDecoder
