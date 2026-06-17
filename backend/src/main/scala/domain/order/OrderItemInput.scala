package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class OrderItemInput(
    menuItemId: MenuItemId,
    quantity: Quantity,
    selections: List[OrderItemSelection],
)
object OrderItemInput:
  given Encoder[OrderItemInput] = deriveEncoder
  given Decoder[OrderItemInput] = Decoder.instance { cursor =>
    for
      menuItemId <- cursor.get[MenuItemId]("menuItemId")
      quantity <- cursor.get[Quantity]("quantity")
      selections <- cursor.getOrElse[List[OrderItemSelection]]("selections")(List.empty)
    yield OrderItemInput(menuItemId = menuItemId, quantity = quantity, selections = selections)
  }
