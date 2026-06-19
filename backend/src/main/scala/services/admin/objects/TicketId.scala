package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class TicketId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object TicketId:
  given WrappedTextType[TicketId] = wrappedTextType(value => new TicketId(value), _.value)
  given Conversion[TicketId, EntityId] = value => new EntityId(value.value)
