package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class Username(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object Username:
  given WrappedTextType[Username] = wrappedTextType(value => new Username(value), _.value)
