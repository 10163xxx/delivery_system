package system.objects

import system.objects.given

import scala.language.implicitConversions

final class RatingValue(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object RatingValue:
  given WrappedIntType[RatingValue] = wrappedIntType(value => new RatingValue(value), _.value)
  given Conversion[RatingValue, Int] = _.value
