package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class FileExtension(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object FileExtension:
  given WrappedTextType[FileExtension] = wrappedTextType(value => new FileExtension(value), _.value)
