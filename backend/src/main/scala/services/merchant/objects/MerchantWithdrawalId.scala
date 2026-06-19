package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import scala.language.implicitConversions

final class MerchantWithdrawalId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantWithdrawalId:
  given WrappedTextType[MerchantWithdrawalId] = wrappedTextType(value => new MerchantWithdrawalId(value), _.value)
  given Conversion[MerchantWithdrawalId, EntityId] = value => new EntityId(value.value)
