package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class CurrencyCents(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object CurrencyCents:
  given WrappedIntType[CurrencyCents] = wrappedIntType(value => new CurrencyCents(value), _.value)
  given Conversion[Int, CurrencyCents] = value => new CurrencyCents(value)
  given Conversion[CurrencyCents, Int] = _.value
