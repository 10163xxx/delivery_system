package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum ReviewStatus:
  case Active, Revoked

object ReviewStatus:
  private val enumLabel = text("ReviewStatus")
  def render(value: ReviewStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[ReviewStatus] = parseEnumValue(value, ReviewStatus.values)
  given Encoder[ReviewStatus] = enumEncoder
  given Decoder[ReviewStatus] = enumDecoder(ReviewStatus.values, enumLabel)
