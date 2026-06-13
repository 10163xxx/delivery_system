package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class PhoneNumber(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PhoneNumber:
  given WrappedTextType[PhoneNumber] = wrappedTextType(value => new PhoneNumber(value), _.value)
