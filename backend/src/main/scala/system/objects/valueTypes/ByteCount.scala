package system.objects

import system.objects.given

import scala.language.implicitConversions

final class ByteCount(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object ByteCount:
  given WrappedIntType[ByteCount] = wrappedIntType(value => new ByteCount(value), _.value)
  given Conversion[ByteCount, Int] = _.value
