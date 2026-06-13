package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class SessionToken(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object SessionToken:
  given WrappedTextType[SessionToken] = wrappedTextType(value => new SessionToken(value), _.value)
  given Conversion[String, SessionToken] = value => new SessionToken(value)
