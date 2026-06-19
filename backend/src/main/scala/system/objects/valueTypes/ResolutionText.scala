package system.objects

import system.objects.given


final class ResolutionText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ResolutionText:
  given WrappedTextType[ResolutionText] = wrappedTextType(value => new ResolutionText(value), _.value)
