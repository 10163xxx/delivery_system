package system.objects

import system.objects.given


final class DescriptionText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DescriptionText:
  given WrappedTextType[DescriptionText] = wrappedTextType(value => new DescriptionText(value), _.value)
