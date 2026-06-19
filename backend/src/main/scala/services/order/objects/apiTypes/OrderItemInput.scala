package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given
import services.merchant.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

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
