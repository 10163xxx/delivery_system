package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class Password(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object Password:
  given WrappedTextType[Password] = wrappedTextType(value => new Password(value), _.value)
