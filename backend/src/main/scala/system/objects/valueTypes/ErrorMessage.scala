package system.objects

import system.objects.given


final class ErrorMessage(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ErrorMessage:
  given WrappedTextType[ErrorMessage] = wrappedTextType(value => new ErrorMessage(value), _.value)
