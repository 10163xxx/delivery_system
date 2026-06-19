package services.customer.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.customer.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class RechargeBalanceRequest(amountCents: CurrencyCents)
object RechargeBalanceRequest:
  given Encoder[RechargeBalanceRequest] = deriveEncoder
  given Decoder[RechargeBalanceRequest] = deriveDecoder
