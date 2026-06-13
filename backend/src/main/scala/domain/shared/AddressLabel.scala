package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AddressLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AddressLabel:
  given WrappedTextType[AddressLabel] = wrappedTextType(value => new AddressLabel(value), _.value)
