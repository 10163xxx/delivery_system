package domain.shared

import domain.shared.given

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

final class PasswordHash(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PasswordHash:
  given WrappedTextType[PasswordHash] = wrappedTextType(value => new PasswordHash(value), _.value)

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
