package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class StoreId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object StoreId:
  given WrappedTextType[StoreId] = wrappedTextType(value => new StoreId(value), _.value)
  given Conversion[StoreId, EntityId] = value => new EntityId(value.value)
