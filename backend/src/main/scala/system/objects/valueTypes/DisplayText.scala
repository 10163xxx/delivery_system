package system.objects

import system.objects.given


final class DisplayText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DisplayText:
  given WrappedTextType[DisplayText] = wrappedTextType(value => new DisplayText(value), _.value)
