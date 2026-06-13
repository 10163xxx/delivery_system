package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ErrorMessage(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ErrorMessage:
  given WrappedTextType[ErrorMessage] = wrappedTextType(value => new ErrorMessage(value), _.value)
