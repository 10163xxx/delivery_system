package system.objects

import system.objects.given


final class MediaTypeText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MediaTypeText:
  given WrappedTextType[MediaTypeText] = wrappedTextType(value => new MediaTypeText(value), _.value)
