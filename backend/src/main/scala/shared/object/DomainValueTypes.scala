package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class EntityId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EntityId:
  given WrappedTextType[EntityId] = wrappedTextType(value => new EntityId(value), _.value)
  given Conversion[String, EntityId] = value => new EntityId(value)

private def textIdType[T](build: String => T, extract: T => String): WrappedTextType[T] =
  wrappedTextType(build, extract)

final class CustomerId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CustomerId:
  given WrappedTextType[CustomerId] = textIdType(value => new CustomerId(value), _.value)
  given Conversion[String, CustomerId] = value => new CustomerId(value)
  given Conversion[CustomerId, EntityId] = value => new EntityId(value.value)

final class StoreId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object StoreId:
  given WrappedTextType[StoreId] = textIdType(value => new StoreId(value), _.value)
  given Conversion[String, StoreId] = value => new StoreId(value)
  given Conversion[StoreId, EntityId] = value => new EntityId(value.value)

final class MenuItemId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MenuItemId:
  given WrappedTextType[MenuItemId] = textIdType(value => new MenuItemId(value), _.value)
  given Conversion[String, MenuItemId] = value => new MenuItemId(value)
  given Conversion[MenuItemId, EntityId] = value => new EntityId(value.value)

final class OrderId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object OrderId:
  given WrappedTextType[OrderId] = textIdType(value => new OrderId(value), _.value)
  given Conversion[String, OrderId] = value => new OrderId(value)
  given Conversion[OrderId, EntityId] = value => new EntityId(value.value)

final class RiderId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RiderId:
  given WrappedTextType[RiderId] = textIdType(value => new RiderId(value), _.value)
  given Conversion[String, RiderId] = value => new RiderId(value)
  given Conversion[RiderId, EntityId] = value => new EntityId(value.value)

final class MerchantId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantId:
  given WrappedTextType[MerchantId] = textIdType(value => new MerchantId(value), _.value)
  given Conversion[String, MerchantId] = value => new MerchantId(value)
  given Conversion[MerchantId, EntityId] = value => new EntityId(value.value)

final class MerchantApplicationId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantApplicationId:
  given WrappedTextType[MerchantApplicationId] = textIdType(value => new MerchantApplicationId(value), _.value)
  given Conversion[String, MerchantApplicationId] = value => new MerchantApplicationId(value)
  given Conversion[MerchantApplicationId, EntityId] = value => new EntityId(value.value)

final class ReviewAppealId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ReviewAppealId:
  given WrappedTextType[ReviewAppealId] = textIdType(value => new ReviewAppealId(value), _.value)
  given Conversion[String, ReviewAppealId] = value => new ReviewAppealId(value)
  given Conversion[ReviewAppealId, EntityId] = value => new EntityId(value.value)

final class EligibilityReviewId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EligibilityReviewId:
  given WrappedTextType[EligibilityReviewId] = textIdType(value => new EligibilityReviewId(value), _.value)
  given Conversion[String, EligibilityReviewId] = value => new EligibilityReviewId(value)
  given Conversion[EligibilityReviewId, EntityId] = value => new EntityId(value.value)

final class TicketId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object TicketId:
  given WrappedTextType[TicketId] = textIdType(value => new TicketId(value), _.value)
  given Conversion[String, TicketId] = value => new TicketId(value)
  given Conversion[TicketId, EntityId] = value => new EntityId(value.value)

final class RefundRequestId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RefundRequestId:
  given WrappedTextType[RefundRequestId] = textIdType(value => new RefundRequestId(value), _.value)
  given Conversion[String, RefundRequestId] = value => new RefundRequestId(value)
  given Conversion[RefundRequestId, EntityId] = value => new EntityId(value.value)

final class CouponId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CouponId:
  given WrappedTextType[CouponId] = textIdType(value => new CouponId(value), _.value)
  given Conversion[String, CouponId] = value => new CouponId(value)
  given Conversion[CouponId, EntityId] = value => new EntityId(value.value)

final class AdminId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AdminId:
  given WrappedTextType[AdminId] = textIdType(value => new AdminId(value), _.value)
  given Conversion[String, AdminId] = value => new AdminId(value)
  given Conversion[AdminId, EntityId] = value => new EntityId(value.value)

final class ChatMessageId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ChatMessageId:
  given WrappedTextType[ChatMessageId] = textIdType(value => new ChatMessageId(value), _.value)
  given Conversion[String, ChatMessageId] = value => new ChatMessageId(value)
  given Conversion[ChatMessageId, EntityId] = value => new EntityId(value.value)

final class AuthUserId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AuthUserId:
  given WrappedTextType[AuthUserId] = textIdType(value => new AuthUserId(value), _.value)
  given Conversion[String, AuthUserId] = value => new AuthUserId(value)
  given Conversion[AuthUserId, EntityId] = value => new EntityId(value.value)

final class MerchantWithdrawalId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MerchantWithdrawalId:
  given WrappedTextType[MerchantWithdrawalId] = textIdType(value => new MerchantWithdrawalId(value), _.value)
  given Conversion[String, MerchantWithdrawalId] = value => new MerchantWithdrawalId(value)
  given Conversion[MerchantWithdrawalId, EntityId] = value => new EntityId(value.value)

final class CurrencyCents(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object CurrencyCents:
  given WrappedIntType[CurrencyCents] = wrappedIntType(value => new CurrencyCents(value), _.value)
  given Conversion[Int, CurrencyCents] = value => new CurrencyCents(value)
  given Conversion[CurrencyCents, Int] = _.value

final class Quantity(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object Quantity:
  given WrappedIntType[Quantity] = wrappedIntType(value => new Quantity(value), _.value)
  given Conversion[Int, Quantity] = value => new Quantity(value)
  given Conversion[Quantity, Int] = _.value

final class RatingValue(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object RatingValue:
  given WrappedIntType[RatingValue] = wrappedIntType(value => new RatingValue(value), _.value)
  given Conversion[Int, RatingValue] = value => new RatingValue(value)
  given Conversion[RatingValue, Int] = _.value

final class EntityCount(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object EntityCount:
  given WrappedIntType[EntityCount] = wrappedIntType(value => new EntityCount(value), _.value)
  given Conversion[Int, EntityCount] = value => new EntityCount(value)
  given Conversion[EntityCount, Int] = _.value

final class Minutes(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object Minutes:
  given WrappedIntType[Minutes] = wrappedIntType(value => new Minutes(value), _.value)
  given Conversion[Int, Minutes] = value => new Minutes(value)
  given Conversion[Minutes, Int] = _.value

final class PercentageValue(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PercentageValue:
  given WrappedIntType[PercentageValue] = wrappedIntType(value => new PercentageValue(value), _.value)
  given Conversion[Int, PercentageValue] = value => new PercentageValue(value)
  given Conversion[PercentageValue, Int] = _.value

final class PortNumber(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PortNumber:
  given WrappedIntType[PortNumber] = wrappedIntType(value => new PortNumber(value), _.value)
  given Conversion[Int, PortNumber] = value => new PortNumber(value)
  given Conversion[PortNumber, Int] = _.value

final class PoolSize(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object PoolSize:
  given WrappedIntType[PoolSize] = wrappedIntType(value => new PoolSize(value), _.value)
  given Conversion[Int, PoolSize] = value => new PoolSize(value)
  given Conversion[PoolSize, Int] = _.value

final class ByteCount(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object ByteCount:
  given WrappedIntType[ByteCount] = wrappedIntType(value => new ByteCount(value), _.value)
  given Conversion[Int, ByteCount] = value => new ByteCount(value)
  given Conversion[ByteCount, Int] = _.value

final class ParameterIndex(val value: Int) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Int = value
object ParameterIndex:
  given WrappedIntType[ParameterIndex] = wrappedIntType(value => new ParameterIndex(value), _.value)
  given Conversion[Int, ParameterIndex] = value => new ParameterIndex(value)
  given Conversion[ParameterIndex, Int] = _.value

final class ApprovalFlag(val value: Boolean) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Boolean = value
object ApprovalFlag:
  given WrappedBooleanType[ApprovalFlag] = wrappedBooleanType(value => new ApprovalFlag(value), _.value)
  given Conversion[Boolean, ApprovalFlag] = value => new ApprovalFlag(value)
  given Conversion[ApprovalFlag, Boolean] = _.value

final class AverageRating(val value: Double) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Double = value
object AverageRating:
  given WrappedDoubleType[AverageRating] = wrappedDoubleType(value => new AverageRating(value), _.value)
  given Conversion[Double, AverageRating] = value => new AverageRating(value)
  given Conversion[AverageRating, Double] = _.value

final class TimeoutMilliseconds(val value: Long) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Long = value
object TimeoutMilliseconds:
  given WrappedLongType[TimeoutMilliseconds] = wrappedLongType(value => new TimeoutMilliseconds(value), _.value)
  given Conversion[Long, TimeoutMilliseconds] = value => new TimeoutMilliseconds(value)
  given Conversion[TimeoutMilliseconds, Long] = _.value

final class DurationDays(val value: Long) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Long = value
object DurationDays:
  given WrappedLongType[DurationDays] = wrappedLongType(value => new DurationDays(value), _.value)
  given Conversion[Long, DurationDays] = value => new DurationDays(value)
  given Conversion[DurationDays, Long] = _.value
