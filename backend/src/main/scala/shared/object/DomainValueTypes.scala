package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class EntityId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EntityId:
  given WrappedTextType[EntityId] = wrappedTextType(value => new EntityId(value), _.value)
  given Conversion[String, EntityId] = value => new EntityId(value)

type CustomerId = EntityId
type StoreId = EntityId
type MenuItemId = EntityId
type OrderId = EntityId
type RiderId = EntityId
type MerchantId = EntityId
type MerchantApplicationId = EntityId
type ReviewAppealId = EntityId
type EligibilityReviewId = EntityId
type TicketId = EntityId
type RefundRequestId = EntityId
type CouponId = EntityId
type AdminId = EntityId
type ChatMessageId = EntityId
type AuthUserId = EntityId

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
