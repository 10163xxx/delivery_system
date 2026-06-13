package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class Quantity(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object Quantity:
  given WrappedIntType[Quantity] = wrappedIntType(value => new Quantity(value), _.value)
  given Conversion[Int, Quantity] = value => new Quantity(value)
  given Conversion[Quantity, Int] = _.value
