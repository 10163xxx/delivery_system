package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.merchant.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class OrderLineItem(
    menuItemId: MenuItemId,
    name: DisplayText,
    quantity: Quantity,
    unitPriceCents: CurrencyCents,
    refundedQuantity: Quantity,
    selections: List[OrderItemSelection],
)
object OrderLineItem:
  given Encoder[OrderLineItem] = deriveEncoder
  given Decoder[OrderLineItem] = Decoder.instance { cursor =>
    for
      menuItemId <- cursor.get[MenuItemId]("menuItemId")
      name <- cursor.get[DisplayText]("name")
      quantity <- cursor.get[Quantity]("quantity")
      unitPriceCents <- cursor.get[CurrencyCents]("unitPriceCents")
      refundedQuantity <- cursor.getOrElse[Quantity]("refundedQuantity")(NumericDefaults.ZeroQuantity)
      selections <- cursor.getOrElse[List[OrderItemSelection]]("selections")(List.empty)
    yield OrderLineItem(
      menuItemId = menuItemId,
      name = name,
      quantity = quantity,
      unitPriceCents = unitPriceCents,
      refundedQuantity = refundedQuantity,
      selections = selections,
    )
  }
