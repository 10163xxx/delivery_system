package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class DisplayText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DisplayText:
  given WrappedTextType[DisplayText] = wrappedTextType(value => new DisplayText(value), _.value)
