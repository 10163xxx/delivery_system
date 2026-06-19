package services.rider.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.rider.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class WithdrawRiderIncomeRequest(amountCents: CurrencyCents)
object WithdrawRiderIncomeRequest:
  given Encoder[WithdrawRiderIncomeRequest] = deriveEncoder
  given Decoder[WithdrawRiderIncomeRequest] = deriveDecoder
