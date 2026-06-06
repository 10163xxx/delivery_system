import {
  ACCOUNT_STATUS,
  AFTER_SALES_REQUEST_TYPE,
  AFTER_SALES_RESOLUTION_MODE,
  APPEAL_ROLE,
  APPEAL_STATUS,
  APPLICATION_STATUS,
  ELIGIBILITY_REVIEW_TARGET,
  MEMBERSHIP_TIER,
  NOTE_STATUS,
  ORDER_STATUS,
  PARTIAL_REFUND_STATUS,
  REVIEW_STATUS,
  RIDER_AVAILABILITY,
  ROLE,
  STORE_CATEGORY,
  STORE_STATUS,
  TICKET_KIND,
  TICKET_STATUS,
} from './DomainConstants'

export type Role = (typeof ROLE)[keyof typeof ROLE]
export type UserRole = Role

declare const domainBrand: unique symbol

export type RawTextValue = ReturnType<StringConstructor>
export type RawNumericValue = ReturnType<NumberConstructor>
export type RawBooleanValue = ReturnType<BooleanConstructor>

type DomainValue<Base, Tag> = Base & { readonly [domainBrand]: Tag }
type TextDomainValue<Tag> = DomainValue<RawTextValue, Tag>
type NumericDomainValue<Tag> = DomainValue<RawNumericValue, Tag>
type BooleanDomainValue<Tag> = DomainValue<RawBooleanValue, Tag>

export function asTextDomainValue<T extends TextDomainValue<unknown>>(value: RawTextValue): T {
  return value as T
}

export function asNumericDomainValue<T extends NumericDomainValue<unknown>>(value: RawNumericValue): T {
  return value as T
}

export function asBooleanDomainValue<T extends BooleanDomainValue<unknown>>(value: RawBooleanValue): T {
  return value as T
}

type EntityIdTag = { readonly entityIdBrand: never }
type CustomerIdTag = { readonly customerIdBrand: never }
type StoreIdTag = { readonly storeIdBrand: never }
type MenuItemIdTag = { readonly menuItemIdBrand: never }
type OrderIdTag = { readonly orderIdBrand: never }
type RiderIdTag = { readonly riderIdBrand: never }
type MerchantIdTag = { readonly merchantIdBrand: never }
type MerchantApplicationIdTag = { readonly merchantApplicationIdBrand: never }
type ReviewAppealIdTag = { readonly reviewAppealIdBrand: never }
type EligibilityReviewIdTag = { readonly eligibilityReviewIdBrand: never }
type TicketIdTag = { readonly ticketIdBrand: never }
type RefundRequestIdTag = { readonly refundRequestIdBrand: never }
type CouponIdTag = { readonly couponIdBrand: never }
type AdminIdTag = { readonly adminIdBrand: never }
type ChatMessageIdTag = { readonly chatMessageIdBrand: never }
type AuthUserIdTag = { readonly authUserIdBrand: never }
type MerchantWithdrawalIdTag = { readonly merchantWithdrawalIdBrand: never }
type PersonNameTag = { readonly personNameBrand: never }
type UsernameTag = { readonly usernameBrand: never }
type PasswordTag = { readonly passwordBrand: never }
type PasswordHashTag = { readonly passwordHashBrand: never }
type SessionTokenTag = { readonly sessionTokenBrand: never }
type DisplayTextTag = { readonly displayTextBrand: never }
type DescriptionTextTag = { readonly descriptionTextBrand: never }
type NoteTextTag = { readonly noteTextBrand: never }
type ReasonTextTag = { readonly reasonTextBrand: never }
type ResolutionTextTag = { readonly resolutionTextBrand: never }
type SummaryTextTag = { readonly summaryTextBrand: never }
type AddressTextTag = { readonly addressTextBrand: never }
type AddressLabelTag = { readonly addressLabelBrand: never }
type PhoneNumberTag = { readonly phoneNumberBrand: never }
type ImageUrlTag = { readonly imageUrlBrand: never }
type ExternalUrlTag = { readonly externalUrlBrand: never }
type BankNameTag = { readonly bankNameBrand: never }
type AccountNumberTag = { readonly accountNumberBrand: never }
type AccountHolderNameTag = { readonly accountHolderNameBrand: never }
type CuisineLabelTag = { readonly cuisineLabelBrand: never }
type VehicleLabelTag = { readonly vehicleLabelBrand: never }
type ZoneLabelTag = { readonly zoneLabelBrand: never }
type TimeOfDayTag = { readonly timeOfDayBrand: never }
type IsoDateTimeTag = { readonly isoDateTimeBrand: never }
type ServiceStatusTag = { readonly serviceStatusBrand: never }
type ServiceNameTag = { readonly serviceNameBrand: never }
type PlannerNameTag = { readonly plannerNameBrand: never }
type FileNameTextTag = { readonly fileNameTextBrand: never }
type NoteIdTag = { readonly noteIdBrand: never }
type NoteTitleTag = { readonly noteTitleBrand: never }
type NoteBodyTag = { readonly noteBodyBrand: never }
type CurrencyCentsTag = { readonly currencyCentsBrand: never }
type QuantityTag = { readonly quantityBrand: never }
type RatingValueTag = { readonly ratingValueBrand: never }
type EntityCountTag = { readonly entityCountBrand: never }
type MinutesTag = { readonly minutesBrand: never }
type PercentageValueTag = { readonly percentageValueBrand: never }
type AverageRatingTag = { readonly averageRatingBrand: never }
type LatitudeTag = { readonly latitudeBrand: never }
type LongitudeTag = { readonly longitudeBrand: never }
type ApprovalFlagTag = { readonly approvalFlagBrand: never }
type EmptySelectionTag = { readonly emptySelectionBrand: never }

export type EntityId = TextDomainValue<EntityIdTag>
export type CustomerId = TextDomainValue<CustomerIdTag>
export type StoreId = TextDomainValue<StoreIdTag>
export type MenuItemId = TextDomainValue<MenuItemIdTag>
export type OrderId = TextDomainValue<OrderIdTag>
export type RiderId = TextDomainValue<RiderIdTag>
export type MerchantId = TextDomainValue<MerchantIdTag>
export type MerchantApplicationId = TextDomainValue<MerchantApplicationIdTag>
export type ReviewAppealId = TextDomainValue<ReviewAppealIdTag>
export type EligibilityReviewId = TextDomainValue<EligibilityReviewIdTag>
export type TicketId = TextDomainValue<TicketIdTag>
export type RefundRequestId = TextDomainValue<RefundRequestIdTag>
export type CouponId = TextDomainValue<CouponIdTag>
export type AdminId = TextDomainValue<AdminIdTag>
export type ChatMessageId = TextDomainValue<ChatMessageIdTag>
export type AuthUserId = TextDomainValue<AuthUserIdTag>
export type MerchantWithdrawalId = TextDomainValue<MerchantWithdrawalIdTag>

export type PersonName = TextDomainValue<PersonNameTag>
export type Username = TextDomainValue<UsernameTag>
export type Password = TextDomainValue<PasswordTag>
export type PasswordHash = TextDomainValue<PasswordHashTag>
export type SessionToken = TextDomainValue<SessionTokenTag>
export type DisplayText = TextDomainValue<DisplayTextTag>
export type DescriptionText = TextDomainValue<DescriptionTextTag>
export type NoteText = TextDomainValue<NoteTextTag>
export type ReasonText = TextDomainValue<ReasonTextTag>
export type ResolutionText = TextDomainValue<ResolutionTextTag>
export type SummaryText = TextDomainValue<SummaryTextTag>
export type AddressText = TextDomainValue<AddressTextTag>
export type AddressLabel = TextDomainValue<AddressLabelTag>
export type PhoneNumber = TextDomainValue<PhoneNumberTag>
export type ImageUrl = TextDomainValue<ImageUrlTag>
export type ExternalUrl = TextDomainValue<ExternalUrlTag>
export type BankName = TextDomainValue<BankNameTag>
export type AccountNumber = TextDomainValue<AccountNumberTag>
export type AccountHolderName = TextDomainValue<AccountHolderNameTag>
export type CuisineLabel = TextDomainValue<CuisineLabelTag>
export type VehicleLabel = TextDomainValue<VehicleLabelTag>
export type ZoneLabel = TextDomainValue<ZoneLabelTag>
export type TimeOfDay = TextDomainValue<TimeOfDayTag>
export type IsoDateTime = TextDomainValue<IsoDateTimeTag>
export type ServiceStatus = TextDomainValue<ServiceStatusTag>
export type ServiceName = TextDomainValue<ServiceNameTag>
export type PlannerName = TextDomainValue<PlannerNameTag>
export type FileNameText = TextDomainValue<FileNameTextTag>
export type NoteId = TextDomainValue<NoteIdTag>
export type NoteTitle = TextDomainValue<NoteTitleTag>
export type NoteBody = TextDomainValue<NoteBodyTag>

export type CurrencyCents = NumericDomainValue<CurrencyCentsTag>
export type Quantity = NumericDomainValue<QuantityTag>
export type RatingValue = NumericDomainValue<RatingValueTag>
export type EntityCount = NumericDomainValue<EntityCountTag>
export type Minutes = NumericDomainValue<MinutesTag>
export type PercentageValue = NumericDomainValue<PercentageValueTag>
export type AverageRating = NumericDomainValue<AverageRatingTag>
export type Latitude = NumericDomainValue<LatitudeTag>
export type Longitude = NumericDomainValue<LongitudeTag>

export type ApprovalFlag = BooleanDomainValue<ApprovalFlagTag>
export type EmptySelection = TextDomainValue<EmptySelectionTag>

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
export type TicketKind = (typeof TICKET_KIND)[keyof typeof TICKET_KIND]
export type AfterSalesRequestType =
  (typeof AFTER_SALES_REQUEST_TYPE)[keyof typeof AFTER_SALES_REQUEST_TYPE]
export type AfterSalesResolutionMode =
  (typeof AFTER_SALES_RESOLUTION_MODE)[keyof typeof AFTER_SALES_RESOLUTION_MODE]
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]
export type MerchantApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]
export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS]
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS]
export type AppealStatus = (typeof APPEAL_STATUS)[keyof typeof APPEAL_STATUS]
export type PartialRefundStatus =
  (typeof PARTIAL_REFUND_STATUS)[keyof typeof PARTIAL_REFUND_STATUS]
export type AppealRole = (typeof APPEAL_ROLE)[keyof typeof APPEAL_ROLE]
export type EligibilityReviewTarget =
  (typeof ELIGIBILITY_REVIEW_TARGET)[keyof typeof ELIGIBILITY_REVIEW_TARGET]
export type MembershipTier = (typeof MEMBERSHIP_TIER)[keyof typeof MEMBERSHIP_TIER]
export type NoteStatus = (typeof NOTE_STATUS)[keyof typeof NOTE_STATUS]
export type StoreStatus = (typeof STORE_STATUS)[keyof typeof STORE_STATUS]
export type AvailabilityLabel = (typeof RIDER_AVAILABILITY)[keyof typeof RIDER_AVAILABILITY]
export type StoreCategory = (typeof STORE_CATEGORY)[keyof typeof STORE_CATEGORY]
