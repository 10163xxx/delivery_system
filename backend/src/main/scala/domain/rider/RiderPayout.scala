package domain.rider

import domain.shared.given

import domain.merchant.{MerchantPayoutAccount, MerchantWithdrawal}
import domain.shared.*
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
