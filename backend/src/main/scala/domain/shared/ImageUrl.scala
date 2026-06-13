package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ImageUrl(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ImageUrl:
  given WrappedTextType[ImageUrl] = wrappedTextType(value => new ImageUrl(value), _.value)
