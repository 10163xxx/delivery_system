package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum AppealRole:
  case Merchant, Rider

object AppealRole:
  private val enumLabel = text("AppealRole")
  def render(value: AppealRole): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AppealRole] = parseEnumValue(value, AppealRole.values)
  given Encoder[AppealRole] = enumEncoder
  given Decoder[AppealRole] = enumDecoder(AppealRole.values, enumLabel)
