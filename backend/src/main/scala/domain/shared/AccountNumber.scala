package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AccountNumber(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AccountNumber:
  given WrappedTextType[AccountNumber] = wrappedTextType(value => new AccountNumber(value), _.value)
