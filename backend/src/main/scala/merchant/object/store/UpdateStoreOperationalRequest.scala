package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateStoreOperationalRequest(
    storeAddress: AddressText,
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
)
object UpdateStoreOperationalRequest:
  given Encoder[UpdateStoreOperationalRequest] = deriveEncoder
  given Decoder[UpdateStoreOperationalRequest] = deriveDecoder
