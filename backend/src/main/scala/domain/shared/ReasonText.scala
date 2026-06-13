package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ReasonText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ReasonText:
  given WrappedTextType[ReasonText] = wrappedTextType(value => new ReasonText(value), _.value)
