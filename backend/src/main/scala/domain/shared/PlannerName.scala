package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class PlannerName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PlannerName:
  given WrappedTextType[PlannerName] = wrappedTextType(value => new PlannerName(value), _.value)
