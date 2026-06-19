package system.objects

import system.objects.given


final class RoutePath(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RoutePath:
  given WrappedTextType[RoutePath] = wrappedTextType(value => new RoutePath(value), _.value)
