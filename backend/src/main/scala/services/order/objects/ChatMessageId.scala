package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class ChatMessageId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ChatMessageId:
  given WrappedTextType[ChatMessageId] = wrappedTextType(value => new ChatMessageId(value), _.value)
  given Conversion[ChatMessageId, EntityId] = value => new EntityId(value.value)
