package domain.merchant

import domain.shared.given

import domain.shared.*
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
