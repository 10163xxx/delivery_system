package services.merchant.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.merchant.objects.*

import system.objects.given
import services.customer.objects.*

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateStoreOperationalRequest(
    storeAddress: AddressText,
    location: Option[StoreLocation],
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
)
object UpdateStoreOperationalRequest:
  given Encoder[UpdateStoreOperationalRequest] = deriveEncoder
  given Decoder[UpdateStoreOperationalRequest] = deriveDecoder
