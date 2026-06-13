package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class CouponId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CouponId:
  given WrappedTextType[CouponId] = wrappedTextType(value => new CouponId(value), _.value)
  given Conversion[String, CouponId] = value => new CouponId(value)
  given Conversion[CouponId, EntityId] = value => new EntityId(value.value)
