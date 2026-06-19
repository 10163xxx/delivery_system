package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class EligibilityReviewId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EligibilityReviewId:
  given WrappedTextType[EligibilityReviewId] = wrappedTextType(value => new EligibilityReviewId(value), _.value)
  given Conversion[EligibilityReviewId, EntityId] = value => new EntityId(value.value)
