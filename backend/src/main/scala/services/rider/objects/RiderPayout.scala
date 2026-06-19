package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import services.merchant.objects.{MerchantPayoutAccount, MerchantWithdrawal}
import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class RiderPayout(
    payoutAccount: Option[MerchantPayoutAccount],
    withdrawnCents: CurrencyCents,
    availableToWithdrawCents: CurrencyCents,
    withdrawalHistory: List[MerchantWithdrawal],
)
object RiderPayout:
  given Encoder[RiderPayout] = deriveEncoder
  given Decoder[RiderPayout] = deriveDecoder
