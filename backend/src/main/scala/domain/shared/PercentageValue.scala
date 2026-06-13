package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class PercentageValue(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PercentageValue:
  given WrappedIntType[PercentageValue] = wrappedIntType(value => new PercentageValue(value), _.value)
  given Conversion[Int, PercentageValue] = value => new PercentageValue(value)
  given Conversion[PercentageValue, Int] = _.value
