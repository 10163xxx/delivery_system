package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ReviewAppealId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ReviewAppealId:
  given WrappedTextType[ReviewAppealId] = wrappedTextType(value => new ReviewAppealId(value), _.value)
  given Conversion[String, ReviewAppealId] = value => new ReviewAppealId(value)
  given Conversion[ReviewAppealId, EntityId] = value => new EntityId(value.value)
