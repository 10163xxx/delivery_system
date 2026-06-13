package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AuthUserId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AuthUserId:
  given WrappedTextType[AuthUserId] = wrappedTextType(value => new AuthUserId(value), _.value)
  given Conversion[String, AuthUserId] = value => new AuthUserId(value)
  given Conversion[AuthUserId, EntityId] = value => new EntityId(value.value)
