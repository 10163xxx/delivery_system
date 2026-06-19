package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class AdminId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AdminId:
  given WrappedTextType[AdminId] = wrappedTextType(value => new AdminId(value), _.value)
  given Conversion[AdminId, EntityId] = value => new EntityId(value.value)
