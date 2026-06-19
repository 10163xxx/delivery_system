package system.objects

import system.objects.given

import scala.language.implicitConversions

final class PercentageValue(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PercentageValue:
  given WrappedIntType[PercentageValue] = wrappedIntType(value => new PercentageValue(value), _.value)
  given Conversion[PercentageValue, Int] = _.value
