package system.objects

import system.objects.given


final class ImageUrl(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ImageUrl:
  given WrappedTextType[ImageUrl] = wrappedTextType(value => new ImageUrl(value), _.value)
