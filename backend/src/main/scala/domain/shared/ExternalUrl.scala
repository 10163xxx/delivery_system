package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ExternalUrl(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ExternalUrl:
  given WrappedTextType[ExternalUrl] = wrappedTextType(value => new ExternalUrl(value), _.value)
