package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class MerchantApplicationId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantApplicationId:
  given WrappedTextType[MerchantApplicationId] = wrappedTextType(value => new MerchantApplicationId(value), _.value)
  given Conversion[MerchantApplicationId, EntityId] = value => new EntityId(value.value)
