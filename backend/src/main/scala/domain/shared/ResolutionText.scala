package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ResolutionText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ResolutionText:
  given WrappedTextType[ResolutionText] = wrappedTextType(value => new ResolutionText(value), _.value)
