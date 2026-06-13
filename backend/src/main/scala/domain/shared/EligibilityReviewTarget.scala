package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum EligibilityReviewTarget:
  case Store, Rider

object EligibilityReviewTarget:
  private val enumLabel = text("EligibilityReviewTarget")
  def render(value: EligibilityReviewTarget): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[EligibilityReviewTarget] = parseEnumValue(value, EligibilityReviewTarget.values)
  given Encoder[EligibilityReviewTarget] = enumEncoder
  given Decoder[EligibilityReviewTarget] = enumDecoder(EligibilityReviewTarget.values, enumLabel)
