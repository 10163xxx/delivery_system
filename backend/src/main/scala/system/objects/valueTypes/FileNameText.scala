package system.objects

import system.objects.given


final class FileNameText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object FileNameText:
  given WrappedTextType[FileNameText] = wrappedTextType(value => new FileNameText(value), _.value)
