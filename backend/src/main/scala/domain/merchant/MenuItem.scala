package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MenuItem(
    id: MenuItemId,
    name: DisplayText,
    category: Option[DisplayText],
    description: DescriptionText,
    priceCents: CurrencyCents,
    imageUrl: Option[ImageUrl],
    remainingQuantity: Option[Quantity],
    selectionGroups: List[MenuItemSelectionGroup],
)
object MenuItem:
  given Encoder[MenuItem] = deriveEncoder
  given Decoder[MenuItem] = Decoder.instance { cursor =>
    for
      id <- cursor.get[MenuItemId]("id")
      name <- cursor.get[DisplayText]("name")
      category <- cursor.getOrElse[Option[DisplayText]]("category")(None)
      description <- cursor.get[DescriptionText]("description")
      priceCents <- cursor.get[CurrencyCents]("priceCents")
      imageUrl <- cursor.get[Option[ImageUrl]]("imageUrl")
      remainingQuantity <- cursor.getOrElse[Option[Quantity]]("remainingQuantity")(None)
      selectionGroups <- cursor.getOrElse[List[MenuItemSelectionGroup]]("selectionGroups")(List.empty)
    yield MenuItem(
      id = id,
      name = name,
      category = category,
      description = description,
      priceCents = priceCents,
      imageUrl = imageUrl,
      remainingQuantity = remainingQuantity,
      selectionGroups = selectionGroups,
    )
  }
