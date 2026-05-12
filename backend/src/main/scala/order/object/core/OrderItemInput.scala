package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class OrderItemInput(menuItemId: MenuItemId, quantity: Quantity)
object OrderItemInput:
  given Encoder[OrderItemInput] = deriveEncoder
  given Decoder[OrderItemInput] = deriveDecoder
