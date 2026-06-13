package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class TimeoutMilliseconds(val value: Long) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Long = value
object TimeoutMilliseconds:
  given WrappedLongType[TimeoutMilliseconds] = wrappedLongType(value => new TimeoutMilliseconds(value), _.value)
  given Conversion[Long, TimeoutMilliseconds] = value => new TimeoutMilliseconds(value)
  given Conversion[TimeoutMilliseconds, Long] = _.value
