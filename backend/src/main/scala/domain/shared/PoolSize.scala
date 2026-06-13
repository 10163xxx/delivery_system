package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class PoolSize(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PoolSize:
  given WrappedIntType[PoolSize] = wrappedIntType(value => new PoolSize(value), _.value)
  given Conversion[Int, PoolSize] = value => new PoolSize(value)
  given Conversion[PoolSize, Int] = _.value
