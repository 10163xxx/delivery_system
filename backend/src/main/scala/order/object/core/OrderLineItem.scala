package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class OrderLineItem(
    menuItemId: MenuItemId,
    name: DisplayText,
    quantity: Quantity,
    unitPriceCents: CurrencyCents,
    refundedQuantity: Quantity,
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
    yield OrderLineItem(
      menuItemId = menuItemId,
      name = name,
      quantity = quantity,
      unitPriceCents = unitPriceCents,
      refundedQuantity = refundedQuantity,
    )
  }
