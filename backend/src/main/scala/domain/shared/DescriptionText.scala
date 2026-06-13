package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class DescriptionText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DescriptionText:
  given WrappedTextType[DescriptionText] = wrappedTextType(value => new DescriptionText(value), _.value)
