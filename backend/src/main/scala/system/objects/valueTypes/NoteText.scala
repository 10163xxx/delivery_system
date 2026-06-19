package system.objects

import system.objects.given


final class NoteText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object NoteText:
  given WrappedTextType[NoteText] = wrappedTextType(value => new NoteText(value), _.value)
