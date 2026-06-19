package system.objects

import system.objects.given

import scala.language.implicitConversions

final class Latitude(val value: Double) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Double = value
object Latitude:
  given WrappedDoubleType[Latitude] = wrappedDoubleType(value => new Latitude(value), _.value)
  given Conversion[Latitude, Double] = _.value
