package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class CuisineLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CuisineLabel:
  given WrappedTextType[CuisineLabel] = wrappedTextType(value => new CuisineLabel(value), _.value)
