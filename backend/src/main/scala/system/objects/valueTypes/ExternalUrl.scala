package system.objects

import system.objects.given


final class ExternalUrl(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ExternalUrl:
  given WrappedTextType[ExternalUrl] = wrappedTextType(value => new ExternalUrl(value), _.value)
