package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class BusinessHours(
    openTime: TimeOfDay,
    closeTime: TimeOfDay,
)
object BusinessHours:
  val DefaultOpenTime: TimeOfDay = new TimeOfDay("09:00")
  val DefaultCloseTime: TimeOfDay = new TimeOfDay("21:00")
  val Default: BusinessHours = BusinessHours(DefaultOpenTime, DefaultCloseTime)
  given Encoder[BusinessHours] = deriveEncoder
  given Decoder[BusinessHours] = deriveDecoder
