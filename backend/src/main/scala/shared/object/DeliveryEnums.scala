package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum OrderStatus:
  case PendingMerchantAcceptance, Preparing, ReadyForPickup, Delivering, Completed, Cancelled, Escalated

object OrderStatus:
  private val enumLabel = text("OrderStatus")
  def render(value: OrderStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[OrderStatus] = parseEnumValue(value, OrderStatus.values)
  given Encoder[OrderStatus] = enumEncoder
  given Decoder[OrderStatus] = enumDecoder(OrderStatus.values, enumLabel)

enum TicketKind:
  case PositiveReview, NegativeReview, DeliveryIssue

object TicketKind:
  private val enumLabel = text("TicketKind")
  def render(value: TicketKind): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[TicketKind] = parseEnumValue(value, TicketKind.values)
  given Encoder[TicketKind] = enumEncoder
  given Decoder[TicketKind] = enumDecoder(TicketKind.values, enumLabel)

enum AfterSalesRequestType:
  case ReturnRequest, CompensationRequest

object AfterSalesRequestType:
  private val enumLabel = text("AfterSalesRequestType")
  def render(value: AfterSalesRequestType): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AfterSalesRequestType] = parseEnumValue(value, AfterSalesRequestType.values)
  given Encoder[AfterSalesRequestType] = enumEncoder
  given Decoder[AfterSalesRequestType] = enumDecoder(AfterSalesRequestType.values, enumLabel)

enum AfterSalesResolutionMode:
  case Balance, Coupon, Manual

object AfterSalesResolutionMode:
  private val enumLabel = text("AfterSalesResolutionMode")
  def render(value: AfterSalesResolutionMode): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AfterSalesResolutionMode] = parseEnumValue(value, AfterSalesResolutionMode.values)
  given Encoder[AfterSalesResolutionMode] = enumEncoder
  given Decoder[AfterSalesResolutionMode] = enumDecoder(AfterSalesResolutionMode.values, enumLabel)

enum TicketStatus:
  case Open, Resolved

object TicketStatus:
  private val enumLabel = text("TicketStatus")
  def render(value: TicketStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[TicketStatus] = parseEnumValue(value, TicketStatus.values)
  given Encoder[TicketStatus] = enumEncoder
  given Decoder[TicketStatus] = enumDecoder(TicketStatus.values, enumLabel)

enum MerchantApplicationStatus:
  case Pending, Approved, Rejected

object MerchantApplicationStatus:
  private val enumLabel = text("MerchantApplicationStatus")
  def render(value: MerchantApplicationStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[MerchantApplicationStatus] = parseEnumValue(value, MerchantApplicationStatus.values)
  given Encoder[MerchantApplicationStatus] = enumEncoder
  given Decoder[MerchantApplicationStatus] = enumDecoder(MerchantApplicationStatus.values, enumLabel)

enum AccountStatus:
  case Active, Suspended

object AccountStatus:
  private val enumLabel = text("AccountStatus")
  def render(value: AccountStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AccountStatus] = parseEnumValue(value, AccountStatus.values)
  given Encoder[AccountStatus] = enumEncoder
  given Decoder[AccountStatus] = enumDecoder(AccountStatus.values, enumLabel)

enum ReviewStatus:
  case Active, Revoked

object ReviewStatus:
  private val enumLabel = text("ReviewStatus")
  def render(value: ReviewStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[ReviewStatus] = parseEnumValue(value, ReviewStatus.values)
  given Encoder[ReviewStatus] = enumEncoder
  given Decoder[ReviewStatus] = enumDecoder(ReviewStatus.values, enumLabel)

enum AppealStatus:
  case Pending, Approved, Rejected

object AppealStatus:
  private val enumLabel = text("AppealStatus")
  def render(value: AppealStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AppealStatus] = parseEnumValue(value, AppealStatus.values)
  given Encoder[AppealStatus] = enumEncoder
  given Decoder[AppealStatus] = enumDecoder(AppealStatus.values, enumLabel)

enum PartialRefundStatus:
  case Pending, Approved, Rejected

object PartialRefundStatus:
  private val enumLabel = text("PartialRefundStatus")
  def render(value: PartialRefundStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[PartialRefundStatus] = parseEnumValue(value, PartialRefundStatus.values)
  given Encoder[PartialRefundStatus] = enumEncoder
  given Decoder[PartialRefundStatus] = enumDecoder(PartialRefundStatus.values, enumLabel)

enum AppealRole:
  case Merchant, Rider

object AppealRole:
  private val enumLabel = text("AppealRole")
  def render(value: AppealRole): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AppealRole] = parseEnumValue(value, AppealRole.values)
  given Encoder[AppealRole] = enumEncoder
  given Decoder[AppealRole] = enumDecoder(AppealRole.values, enumLabel)

enum EligibilityReviewTarget:
  case Store, Rider

object EligibilityReviewTarget:
  private val enumLabel = text("EligibilityReviewTarget")
  def render(value: EligibilityReviewTarget): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[EligibilityReviewTarget] = parseEnumValue(value, EligibilityReviewTarget.values)
  given Encoder[EligibilityReviewTarget] = enumEncoder
  given Decoder[EligibilityReviewTarget] = enumDecoder(EligibilityReviewTarget.values, enumLabel)

enum MembershipTier:
  case Standard, Member

object MembershipTier:
  private val enumLabel = text("MembershipTier")
  def render(value: MembershipTier): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[MembershipTier] = parseEnumValue(value, MembershipTier.values)
  given Encoder[MembershipTier] = enumEncoder
  given Decoder[MembershipTier] = enumDecoder(MembershipTier.values, enumLabel)

enum UserRole:
  case customer, merchant, rider, admin

object UserRole:
  private val enumLabel = text("UserRole")
  def render(value: UserRole): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[UserRole] = parseEnumValue(value, UserRole.values)
  given Encoder[UserRole] = enumEncoder
  given Decoder[UserRole] = enumDecoder(UserRole.values, enumLabel)
