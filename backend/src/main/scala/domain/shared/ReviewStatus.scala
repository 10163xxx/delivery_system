package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum ReviewStatus:
  case Active, Revoked

object ReviewStatus:
  private val enumLabel = text("ReviewStatus")
  def render(value: ReviewStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[ReviewStatus] = parseEnumValue(value, ReviewStatus.values)
  given Encoder[ReviewStatus] = enumEncoder
  given Decoder[ReviewStatus] = enumDecoder(ReviewStatus.values, enumLabel)
