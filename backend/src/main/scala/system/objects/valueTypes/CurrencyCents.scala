package system.objects

import system.objects.given

import scala.language.implicitConversions

final class CurrencyCents(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object CurrencyCents:
  given WrappedIntType[CurrencyCents] = wrappedIntType(value => new CurrencyCents(value), _.value)
  given Conversion[CurrencyCents, Int] = _.value
