package system.objects

import system.objects.given


final class UrlText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object UrlText:
  given WrappedTextType[UrlText] = wrappedTextType(value => new UrlText(value), _.value)
