package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MerchantWithdrawal(
    id: EntityId,
    amountCents: CurrencyCents,
    accountLabel: DisplayText,
    requestedAt: IsoDateTime,
)
object MerchantWithdrawal:
  given Encoder[MerchantWithdrawal] = deriveEncoder
  given Decoder[MerchantWithdrawal] = deriveDecoder
