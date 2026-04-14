export type Role = 'customer' | 'merchant' | 'rider' | 'admin'

declare const domainBrand: unique symbol

type DomainValue<Base, Tag> = Base & { readonly [domainBrand]?: Tag }
type TextDomainValue<Tag> = DomainValue<string, Tag>
type NumericDomainValue<Tag> = DomainValue<number, Tag>
type BooleanDomainValue<Tag> = DomainValue<boolean, Tag>

type EntityIdTag = { readonly entityIdBrand: never }
type PersonNameTag = { readonly personNameBrand: never }
type UsernameTag = { readonly usernameBrand: never }
type PasswordTag = { readonly passwordBrand: never }
type SessionTokenTag = { readonly sessionTokenBrand: never }
type DisplayTextTag = { readonly displayTextBrand: never }
type DescriptionTextTag = { readonly descriptionTextBrand: never }
type NoteTextTag = { readonly noteTextBrand: never }
type ReasonTextTag = { readonly reasonTextBrand: never }
type ResolutionTextTag = { readonly resolutionTextBrand: never }
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
type CurrencyCentsTag = { readonly currencyCentsBrand: never }
type QuantityTag = { readonly quantityBrand: never }
type RatingValueTag = { readonly ratingValueBrand: never }
type EntityCountTag = { readonly entityCountBrand: never }
type MinutesTag = { readonly minutesBrand: never }
type PercentageValueTag = { readonly percentageValueBrand: never }
type ApprovalFlagTag = { readonly approvalFlagBrand: never }
type EmptySelectionTag = { readonly emptySelectionBrand: never }

export type EntityId = TextDomainValue<EntityIdTag>
export type CustomerId = EntityId
export type StoreId = EntityId
export type MenuItemId = EntityId
export type OrderId = EntityId
export type RiderId = EntityId
export type MerchantId = EntityId
export type MerchantApplicationId = EntityId
export type ReviewAppealId = EntityId
export type EligibilityReviewId = EntityId
export type TicketId = EntityId
export type RefundRequestId = EntityId
export type CouponId = EntityId
export type AdminId = EntityId
export type ChatMessageId = EntityId
export type AuthUserId = EntityId

export type PersonName = TextDomainValue<PersonNameTag>
export type Username = TextDomainValue<UsernameTag>
export type Password = TextDomainValue<PasswordTag>
export type SessionToken = TextDomainValue<SessionTokenTag>
export type DisplayText = TextDomainValue<DisplayTextTag>
export type DescriptionText = TextDomainValue<DescriptionTextTag>
export type NoteText = TextDomainValue<NoteTextTag>
export type ReasonText = TextDomainValue<ReasonTextTag>
export type ResolutionText = TextDomainValue<ResolutionTextTag>
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

export type CurrencyCents = NumericDomainValue<CurrencyCentsTag>
export type Quantity = NumericDomainValue<QuantityTag>
export type RatingValue = NumericDomainValue<RatingValueTag>
export type EntityCount = NumericDomainValue<EntityCountTag>
export type Minutes = NumericDomainValue<MinutesTag>
export type PercentageValue = NumericDomainValue<PercentageValueTag>

export type ApprovalFlag = BooleanDomainValue<ApprovalFlagTag>
export type EmptySelection = TextDomainValue<EmptySelectionTag>

export type OrderStatus =
  | 'PendingMerchantAcceptance'
  | 'Preparing'
  | 'ReadyForPickup'
  | 'Delivering'
  | 'Completed'
  | 'Cancelled'
  | 'Escalated'

export type TicketKind =
  | 'PositiveReview'
  | 'NegativeReview'
  | 'DeliveryIssue'

export type AfterSalesRequestType = 'ReturnRequest' | 'CompensationRequest'
export type AfterSalesResolutionMode = 'Balance' | 'Coupon' | 'Manual'

export type TicketStatus = 'Open' | 'Resolved'
export type MerchantApplicationStatus = 'Pending' | 'Approved' | 'Rejected'
export type AccountStatus = 'Active' | 'Suspended'
export type ReviewStatus = 'Active' | 'Revoked'
export type AppealStatus = 'Pending' | 'Approved' | 'Rejected'
export type PartialRefundStatus = 'Pending' | 'Approved' | 'Rejected'
export type AppealRole = 'Merchant' | 'Rider'
export type EligibilityReviewTarget = 'Store' | 'Rider'
export type MembershipTier = 'Standard' | 'Member'
export type StoreCategory =
  | '中式快餐'
  | '盖饭简餐'
  | '面馆粉档'
  | '麻辣香锅'
  | '饺子馄饨'
  | '轻食沙拉'
  | '咖啡甜点'
  | '奶茶果饮'
  | '夜宵小吃'
