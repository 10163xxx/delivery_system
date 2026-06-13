package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class EligibilityReviewId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EligibilityReviewId:
  given WrappedTextType[EligibilityReviewId] = wrappedTextType(value => new EligibilityReviewId(value), _.value)
  given Conversion[String, EligibilityReviewId] = value => new EligibilityReviewId(value)
  given Conversion[EligibilityReviewId, EntityId] = value => new EntityId(value.value)
