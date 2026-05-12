package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class RechargeBalanceRequest(amountCents: CurrencyCents)
object RechargeBalanceRequest:
  given Encoder[RechargeBalanceRequest] = deriveEncoder
  given Decoder[RechargeBalanceRequest] = deriveDecoder
