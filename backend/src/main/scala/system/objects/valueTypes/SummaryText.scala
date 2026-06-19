package system.objects

import system.objects.given


final class SummaryText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object SummaryText:
  given WrappedTextType[SummaryText] = wrappedTextType(value => new SummaryText(value), _.value)
