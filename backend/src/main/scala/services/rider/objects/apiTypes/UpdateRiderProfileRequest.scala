package services.rider.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.rider.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import services.merchant.objects.MerchantPayoutAccount
import system.objects.*

final case class UpdateRiderProfileRequest(
    payoutAccount: MerchantPayoutAccount,
)
object UpdateRiderProfileRequest:
  given Encoder[UpdateRiderProfileRequest] = deriveEncoder
  given Decoder[UpdateRiderProfileRequest] = deriveDecoder
