package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class CustomerId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CustomerId:
  given WrappedTextType[CustomerId] = wrappedTextType(value => new CustomerId(value), _.value)
  given Conversion[CustomerId, EntityId] = value => new EntityId(value.value)
