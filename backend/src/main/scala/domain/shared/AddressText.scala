package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AddressText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AddressText:
  given WrappedTextType[AddressText] = wrappedTextType(value => new AddressText(value), _.value)
