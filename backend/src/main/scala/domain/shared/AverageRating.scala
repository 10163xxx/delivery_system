package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AverageRating(val value: Double) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Double = value
object AverageRating:
  given WrappedDoubleType[AverageRating] = wrappedDoubleType(value => new AverageRating(value), _.value)
  given Conversion[Double, AverageRating] = value => new AverageRating(value)
  given Conversion[AverageRating, Double] = _.value
