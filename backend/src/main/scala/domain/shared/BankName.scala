package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class BankName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object BankName:
  given WrappedTextType[BankName] = wrappedTextType(value => new BankName(value), _.value)
