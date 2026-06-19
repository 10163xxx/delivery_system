package services.merchant.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.merchant.objects.*

import system.objects.given
import services.customer.objects.*

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MerchantRegistrationRequest(
    merchantName: PersonName,
    storeName: DisplayText,
    category: DisplayText,
    storeAddress: AddressText,
    location: Option[StoreLocation],
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
    imageUrl: Option[ImageUrl],
    note: Option[NoteText],
)
object MerchantRegistrationRequest:
  given Encoder[MerchantRegistrationRequest] = deriveEncoder
  given Decoder[MerchantRegistrationRequest] = deriveDecoder
