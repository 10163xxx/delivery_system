package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class OrderId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object OrderId:
  given WrappedTextType[OrderId] = wrappedTextType(value => new OrderId(value), _.value)
  given Conversion[OrderId, EntityId] = value => new EntityId(value.value)
