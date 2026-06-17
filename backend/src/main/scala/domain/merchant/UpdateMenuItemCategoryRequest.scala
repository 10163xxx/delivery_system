package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateMenuItemCategoryRequest(
    category: DisplayText,
)
object UpdateMenuItemCategoryRequest:
  given Encoder[UpdateMenuItemCategoryRequest] = deriveEncoder
  given Decoder[UpdateMenuItemCategoryRequest] = deriveDecoder
