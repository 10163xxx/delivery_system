package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateMenuItemStockRequest(
    remainingQuantity: Option[Quantity],
)
object UpdateMenuItemStockRequest:
  given Encoder[UpdateMenuItemStockRequest] = deriveEncoder
  given Decoder[UpdateMenuItemStockRequest] = deriveDecoder
