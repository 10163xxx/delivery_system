package domain.rider

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.merchant.MerchantPayoutAccount
import domain.shared.*

final case class UpdateRiderProfileRequest(
    payoutAccount: MerchantPayoutAccount,
)
object UpdateRiderProfileRequest:
  given Encoder[UpdateRiderProfileRequest] = deriveEncoder
  given Decoder[UpdateRiderProfileRequest] = deriveDecoder
