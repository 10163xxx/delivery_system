package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ChatMessageId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ChatMessageId:
  given WrappedTextType[ChatMessageId] = wrappedTextType(value => new ChatMessageId(value), _.value)
  given Conversion[String, ChatMessageId] = value => new ChatMessageId(value)
  given Conversion[ChatMessageId, EntityId] = value => new EntityId(value.value)
