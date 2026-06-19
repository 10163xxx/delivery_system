package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class MerchantId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantId:
  given WrappedTextType[MerchantId] = wrappedTextType(value => new MerchantId(value), _.value)
  given Conversion[MerchantId, EntityId] = value => new EntityId(value.value)
