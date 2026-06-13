package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class MerchantId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantId:
  given WrappedTextType[MerchantId] = wrappedTextType(value => new MerchantId(value), _.value)
  given Conversion[String, MerchantId] = value => new MerchantId(value)
  given Conversion[MerchantId, EntityId] = value => new EntityId(value.value)
