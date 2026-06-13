package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class Longitude(val value: Double) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Double = value
object Longitude:
  given WrappedDoubleType[Longitude] = wrappedDoubleType(value => new Longitude(value), _.value)
  given Conversion[Double, Longitude] = value => new Longitude(value)
  given Conversion[Longitude, Double] = _.value
