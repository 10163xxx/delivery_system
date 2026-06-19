package system.objects

import system.objects.given


final class ReasonText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ReasonText:
  given WrappedTextType[ReasonText] = wrappedTextType(value => new ReasonText(value), _.value)
