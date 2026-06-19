package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class ReviewAppealId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ReviewAppealId:
  given WrappedTextType[ReviewAppealId] = wrappedTextType(value => new ReviewAppealId(value), _.value)
  given Conversion[ReviewAppealId, EntityId] = value => new EntityId(value.value)
