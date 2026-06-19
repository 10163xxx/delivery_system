package system.objects

import system.objects.given


final class ServiceStatus(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ServiceStatus:
  given WrappedTextType[ServiceStatus] = wrappedTextType(value => new ServiceStatus(value), _.value)
