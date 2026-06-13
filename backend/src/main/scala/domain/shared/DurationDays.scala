package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class DurationDays(val value: Long) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Long = value
object DurationDays:
  given WrappedLongType[DurationDays] = wrappedLongType(value => new DurationDays(value), _.value)
  given Conversion[Long, DurationDays] = value => new DurationDays(value)
  given Conversion[DurationDays, Long] = _.value
