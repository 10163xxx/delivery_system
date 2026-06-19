package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
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
