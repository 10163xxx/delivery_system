package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class PortNumber(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PortNumber:
  given WrappedIntType[PortNumber] = wrappedIntType(value => new PortNumber(value), _.value)
  given Conversion[Int, PortNumber] = value => new PortNumber(value)
  given Conversion[PortNumber, Int] = _.value
