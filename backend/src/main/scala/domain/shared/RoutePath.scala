package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class RoutePath(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RoutePath:
  given WrappedTextType[RoutePath] = wrappedTextType(value => new RoutePath(value), _.value)
