package system.objects

import system.objects.given

import scala.language.implicitConversions

final class EntityCount(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object EntityCount:
  given WrappedIntType[EntityCount] = wrappedIntType(value => new EntityCount(value), _.value)
  given Conversion[EntityCount, Int] = _.value
