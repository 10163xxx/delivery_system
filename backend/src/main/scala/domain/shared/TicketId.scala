package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class TicketId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object TicketId:
  given WrappedTextType[TicketId] = wrappedTextType(value => new TicketId(value), _.value)
  given Conversion[String, TicketId] = value => new TicketId(value)
  given Conversion[TicketId, EntityId] = value => new EntityId(value.value)
