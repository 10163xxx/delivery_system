package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class StoreIdentity(
    id: StoreId,
    merchantName: PersonName,
    name: DisplayText,
    category: DisplayText,
    cuisine: CuisineLabel,
)
object StoreIdentity:
  given Encoder[StoreIdentity] = deriveEncoder
  given Decoder[StoreIdentity] = deriveDecoder
