export type Role = 'customer' | 'merchant' | 'rider' | 'admin'

export type EntityId = string
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

export type PersonName = string
export type Username = string
export type Password = string
export type SessionToken = string
export type DisplayText = string
export type DescriptionText = string
export type NoteText = string
export type ReasonText = string
export type ResolutionText = string
export type AddressText = string
export type AddressLabel = string
export type PhoneNumber = string
export type ImageUrl = string
export type ExternalUrl = string
export type BankName = string
export type AccountNumber = string
export type AccountHolderName = string
export type CuisineLabel = string
export type VehicleLabel = string
export type ZoneLabel = string
export type TimeOfDay = string
export type IsoDateTime = string

export type CurrencyCents = number
export type Quantity = number
export type RatingValue = number
export type EntityCount = number
export type Minutes = number
export type PercentageValue = number

export type ApprovalFlag = boolean

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
