package domain.rider

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class WithdrawRiderIncomeRequest(amountCents: CurrencyCents)
object WithdrawRiderIncomeRequest:
  given Encoder[WithdrawRiderIncomeRequest] = deriveEncoder
  given Decoder[WithdrawRiderIncomeRequest] = deriveDecoder
