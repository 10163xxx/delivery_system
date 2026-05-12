package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateMerchantProfileRequest(
    contactPhone: PhoneNumber,
    payoutAccount: MerchantPayoutAccount,
)
object UpdateMerchantProfileRequest:
  given Encoder[UpdateMerchantProfileRequest] = deriveEncoder
  given Decoder[UpdateMerchantProfileRequest] = deriveDecoder
