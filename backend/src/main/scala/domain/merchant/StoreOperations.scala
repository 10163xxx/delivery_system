package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class StoreOperations(
    status: DisplayText,
    storeAddress: AddressText,
    location: Option[StoreLocation],
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
    imageUrl: Option[ImageUrl],
    menu: List[MenuItem],
)
object StoreOperations:
  given Encoder[StoreOperations] = deriveEncoder
  given Decoder[StoreOperations] = deriveDecoder
