package system.objects

import system.objects.given

import scala.language.implicitConversions

final class ParameterIndex(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object ParameterIndex:
  given WrappedIntType[ParameterIndex] = wrappedIntType(value => new ParameterIndex(value), _.value)
  given Conversion[ParameterIndex, Int] = _.value
