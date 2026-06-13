package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class MediaTypeText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MediaTypeText:
  given WrappedTextType[MediaTypeText] = wrappedTextType(value => new MediaTypeText(value), _.value)
