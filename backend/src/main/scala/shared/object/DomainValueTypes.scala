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

final class PersonName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PersonName:
  given WrappedTextType[PersonName] = wrappedTextType(value => new PersonName(value), _.value)

final class Username(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object Username:
  given WrappedTextType[Username] = wrappedTextType(value => new Username(value), _.value)

final class Password(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object Password:
  given WrappedTextType[Password] = wrappedTextType(value => new Password(value), _.value)

final class SessionToken(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object SessionToken:
  given WrappedTextType[SessionToken] = wrappedTextType(value => new SessionToken(value), _.value)
  given Conversion[String, SessionToken] = value => new SessionToken(value)

final class DisplayText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DisplayText:
  given WrappedTextType[DisplayText] = wrappedTextType(value => new DisplayText(value), _.value)

final class DescriptionText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DescriptionText:
  given WrappedTextType[DescriptionText] = wrappedTextType(value => new DescriptionText(value), _.value)

final class NoteText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object NoteText:
  given WrappedTextType[NoteText] = wrappedTextType(value => new NoteText(value), _.value)

final class ReasonText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ReasonText:
  given WrappedTextType[ReasonText] = wrappedTextType(value => new ReasonText(value), _.value)

final class ResolutionText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ResolutionText:
  given WrappedTextType[ResolutionText] = wrappedTextType(value => new ResolutionText(value), _.value)

final class SummaryText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object SummaryText:
  given WrappedTextType[SummaryText] = wrappedTextType(value => new SummaryText(value), _.value)

final class AddressText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AddressText:
  given WrappedTextType[AddressText] = wrappedTextType(value => new AddressText(value), _.value)

final class AddressLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AddressLabel:
  given WrappedTextType[AddressLabel] = wrappedTextType(value => new AddressLabel(value), _.value)

final class PhoneNumber(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PhoneNumber:
  given WrappedTextType[PhoneNumber] = wrappedTextType(value => new PhoneNumber(value), _.value)

final class ImageUrl(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ImageUrl:
  given WrappedTextType[ImageUrl] = wrappedTextType(value => new ImageUrl(value), _.value)

final class ExternalUrl(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ExternalUrl:
  given WrappedTextType[ExternalUrl] = wrappedTextType(value => new ExternalUrl(value), _.value)

final class BankName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object BankName:
  given WrappedTextType[BankName] = wrappedTextType(value => new BankName(value), _.value)

final class AccountNumber(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AccountNumber:
  given WrappedTextType[AccountNumber] = wrappedTextType(value => new AccountNumber(value), _.value)

final class AccountHolderName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AccountHolderName:
  given WrappedTextType[AccountHolderName] = wrappedTextType(value => new AccountHolderName(value), _.value)

final class CuisineLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CuisineLabel:
  given WrappedTextType[CuisineLabel] = wrappedTextType(value => new CuisineLabel(value), _.value)

final class VehicleLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object VehicleLabel:
  given WrappedTextType[VehicleLabel] = wrappedTextType(value => new VehicleLabel(value), _.value)

final class ZoneLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ZoneLabel:
  given WrappedTextType[ZoneLabel] = wrappedTextType(value => new ZoneLabel(value), _.value)

final class AvailabilityLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AvailabilityLabel:
  given WrappedTextType[AvailabilityLabel] = wrappedTextType(value => new AvailabilityLabel(value), _.value)

final class TimeOfDay(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object TimeOfDay:
  given WrappedTextType[TimeOfDay] = wrappedTextType(value => new TimeOfDay(value), _.value)

final class IsoDateTime(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object IsoDateTime:
  given WrappedTextType[IsoDateTime] = wrappedTextType(value => new IsoDateTime(value), _.value)

final class ServiceStatus(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ServiceStatus:
  given WrappedTextType[ServiceStatus] = wrappedTextType(value => new ServiceStatus(value), _.value)

final class ServiceName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ServiceName:
  given WrappedTextType[ServiceName] = wrappedTextType(value => new ServiceName(value), _.value)

final class ErrorMessage(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ErrorMessage:
  given WrappedTextType[ErrorMessage] = wrappedTextType(value => new ErrorMessage(value), _.value)

final class EnvVarName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EnvVarName:
  given WrappedTextType[EnvVarName] = wrappedTextType(value => new EnvVarName(value), _.value)

final class HostName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object HostName:
  given WrappedTextType[HostName] = wrappedTextType(value => new HostName(value), _.value)

final class DatabaseName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DatabaseName:
  given WrappedTextType[DatabaseName] = wrappedTextType(value => new DatabaseName(value), _.value)

final class SqlStatement(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object SqlStatement:
  given WrappedTextType[SqlStatement] = wrappedTextType(value => new SqlStatement(value), _.value)

final class UrlText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object UrlText:
  given WrappedTextType[UrlText] = wrappedTextType(value => new UrlText(value), _.value)

final class PlannerName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PlannerName:
  given WrappedTextType[PlannerName] = wrappedTextType(value => new PlannerName(value), _.value)

final class FileNameText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object FileNameText:
  given WrappedTextType[FileNameText] = wrappedTextType(value => new FileNameText(value), _.value)

final class MediaTypeText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MediaTypeText:
  given WrappedTextType[MediaTypeText] = wrappedTextType(value => new MediaTypeText(value), _.value)

final class FileExtension(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object FileExtension:
  given WrappedTextType[FileExtension] = wrappedTextType(value => new FileExtension(value), _.value)

final class RoutePath(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RoutePath:
  given WrappedTextType[RoutePath] = wrappedTextType(value => new RoutePath(value), _.value)

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
