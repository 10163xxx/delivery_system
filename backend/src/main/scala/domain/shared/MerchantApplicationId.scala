package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class MerchantApplicationId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantApplicationId:
  given WrappedTextType[MerchantApplicationId] = wrappedTextType(value => new MerchantApplicationId(value), _.value)
  given Conversion[String, MerchantApplicationId] = value => new MerchantApplicationId(value)
  given Conversion[MerchantApplicationId, EntityId] = value => new EntityId(value.value)
