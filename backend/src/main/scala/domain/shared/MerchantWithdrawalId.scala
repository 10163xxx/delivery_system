package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class MerchantWithdrawalId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantWithdrawalId:
  given WrappedTextType[MerchantWithdrawalId] = wrappedTextType(value => new MerchantWithdrawalId(value), _.value)
  given Conversion[String, MerchantWithdrawalId] = value => new MerchantWithdrawalId(value)
  given Conversion[MerchantWithdrawalId, EntityId] = value => new EntityId(value.value)
