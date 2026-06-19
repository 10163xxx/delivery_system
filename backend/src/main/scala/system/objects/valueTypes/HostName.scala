package system.objects

import system.objects.given


final class HostName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object HostName:
  given WrappedTextType[HostName] = wrappedTextType(value => new HostName(value), _.value)
