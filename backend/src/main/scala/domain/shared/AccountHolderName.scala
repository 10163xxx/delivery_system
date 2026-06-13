package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AccountHolderName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AccountHolderName:
  given WrappedTextType[AccountHolderName] = wrappedTextType(value => new AccountHolderName(value), _.value)
