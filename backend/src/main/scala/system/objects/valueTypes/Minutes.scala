package system.objects

import system.objects.given

import scala.language.implicitConversions

final class Minutes(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object Minutes:
  given WrappedIntType[Minutes] = wrappedIntType(value => new Minutes(value), _.value)
  given Conversion[Minutes, Int] = _.value
