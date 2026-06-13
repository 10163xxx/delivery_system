package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class UrlText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object UrlText:
  given WrappedTextType[UrlText] = wrappedTextType(value => new UrlText(value), _.value)
