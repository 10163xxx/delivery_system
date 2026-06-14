package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class WithdrawMerchantIncomeRequest(amountCents: CurrencyCents)
object WithdrawMerchantIncomeRequest:
  given Encoder[WithdrawMerchantIncomeRequest] = deriveEncoder
  given Decoder[WithdrawMerchantIncomeRequest] = deriveDecoder
