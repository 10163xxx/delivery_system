package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class PasswordHash(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PasswordHash:
  given WrappedTextType[PasswordHash] = wrappedTextType(value => new PasswordHash(value), _.value)
