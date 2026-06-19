package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class AuthUserId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AuthUserId:
  given WrappedTextType[AuthUserId] = wrappedTextType(value => new AuthUserId(value), _.value)
  given Conversion[AuthUserId, EntityId] = value => new EntityId(value.value)
