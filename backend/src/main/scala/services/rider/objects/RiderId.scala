package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class RiderId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RiderId:
  given WrappedTextType[RiderId] = wrappedTextType(value => new RiderId(value), _.value)
  given Conversion[RiderId, EntityId] = value => new EntityId(value.value)
