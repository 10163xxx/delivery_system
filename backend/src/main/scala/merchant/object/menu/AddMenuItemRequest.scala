package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class AddMenuItemRequest(
    name: DisplayText,
    category: Option[DisplayText],
    description: DescriptionText,
    priceCents: CurrencyCents,
    imageUrl: Option[ImageUrl],
    remainingQuantity: Option[Quantity],
    selectionGroups: List[MenuItemSelectionGroup],
)
object AddMenuItemRequest:
  given Encoder[AddMenuItemRequest] = deriveEncoder
  given Decoder[AddMenuItemRequest] = deriveDecoder
