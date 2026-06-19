package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.customer.objects.*

import system.objects.*
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
