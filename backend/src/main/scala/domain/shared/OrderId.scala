package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class OrderId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object OrderId:
  given WrappedTextType[OrderId] = wrappedTextType(value => new OrderId(value), _.value)
  given Conversion[String, OrderId] = value => new OrderId(value)
  given Conversion[OrderId, EntityId] = value => new EntityId(value.value)
