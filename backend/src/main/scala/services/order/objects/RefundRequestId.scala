package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class RefundRequestId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RefundRequestId:
  given WrappedTextType[RefundRequestId] = wrappedTextType(value => new RefundRequestId(value), _.value)
  given Conversion[RefundRequestId, EntityId] = value => new EntityId(value.value)
