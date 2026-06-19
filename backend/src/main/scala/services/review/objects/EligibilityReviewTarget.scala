package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum EligibilityReviewTarget:
  case Store, Rider

object EligibilityReviewTarget:
  private val enumLabel = text("EligibilityReviewTarget")
  def render(value: EligibilityReviewTarget): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[EligibilityReviewTarget] = parseEnumValue(value, EligibilityReviewTarget.values)
  given Encoder[EligibilityReviewTarget] = enumEncoder
  given Decoder[EligibilityReviewTarget] = enumDecoder(EligibilityReviewTarget.values, enumLabel)
