package system.objects

import system.objects.given

import scala.language.implicitConversions

final class Longitude(val value: Double) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Double = value
object Longitude:
  given WrappedDoubleType[Longitude] = wrappedDoubleType(value => new Longitude(value), _.value)
  given Conversion[Longitude, Double] = _.value
