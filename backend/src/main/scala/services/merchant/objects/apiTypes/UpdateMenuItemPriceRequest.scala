package services.merchant.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.merchant.objects.*

import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateMenuItemPriceRequest(
    priceCents: CurrencyCents,
)
object UpdateMenuItemPriceRequest:
  given Encoder[UpdateMenuItemPriceRequest] = deriveEncoder
  given Decoder[UpdateMenuItemPriceRequest] = deriveDecoder
