package system.objects

import system.objects.given


final class IsoDateTime(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object IsoDateTime:
  given WrappedTextType[IsoDateTime] = wrappedTextType(value => new IsoDateTime(value), _.value)
