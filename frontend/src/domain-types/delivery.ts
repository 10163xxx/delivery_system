export type Role = 'customer' | 'merchant' | 'rider' | 'admin'

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

export interface AddressEntry {
  label: string
  address: string
}

export interface Coupon {
  id: string
  title: string
  discountCents: number
  minimumSpendCents: number
  description: string
  expiresAt: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  defaultAddress: string
  addresses: AddressEntry[]
  accountStatus: AccountStatus
  revokedReviewCount: number
  membershipTier: MembershipTier
  monthlySpendCents: number
  balanceCents: number
  coupons: Coupon[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  priceCents: number
  imageUrl?: string
  remainingQuantity?: number
}

export interface BusinessHours {
  openTime: string
  closeTime: string
}

export interface Store {
  id: string
  merchantName: string
  name: string
  category: StoreCategory
  cuisine: string
  status: 'Open' | 'Busy' | 'Revoked'
  businessHours: BusinessHours
  avgPrepMinutes: number
  imageUrl?: string
  menu: MenuItem[]
  averageRating: number
  ratingCount: number
  oneStarRatingCount: number
  revenueCents: number
}

export interface Rider {
  id: string
  name: string
  vehicle: string
  zone: string
  availability: 'Available' | 'OnDelivery' | 'Suspended'
  averageRating: number
  ratingCount: number
  oneStarRatingCount: number
  earningsCents: number
  payoutAccount?: MerchantPayoutAccount
  withdrawnCents: number
  availableToWithdrawCents: number
  withdrawalHistory: MerchantWithdrawal[]
}

export interface AdminProfile {
  id: string
  name: string
}

export interface MerchantWithdrawal {
  id: string
  amountCents: number
  accountLabel: string
  requestedAt: string
}

export type MerchantPayoutAccountType = 'alipay' | 'bank'

export interface MerchantPayoutAccount {
  accountType: MerchantPayoutAccountType
  bankName?: string
  accountNumber: string
  accountHolder: string
}

export interface MerchantProfile {
  id: string
  merchantName: string
  contactPhone: string
  payoutAccount?: MerchantPayoutAccount
  settledIncomeCents: number
  withdrawnCents: number
  availableToWithdrawCents: number
  withdrawalHistory: MerchantWithdrawal[]
}

export interface UpdateRiderProfileRequest {
  payoutAccount: MerchantPayoutAccount
}

export interface WithdrawRiderIncomeRequest {
  amountCents: number
}

export interface MerchantApplication {
  id: string
  merchantName: string
  storeName: string
  category: StoreCategory
  businessHours: BusinessHours
  avgPrepMinutes: number
  imageUrl?: string
  note?: string
  status: MerchantApplicationStatus
  reviewNote?: string
  submittedAt: string
  reviewedAt?: string
}

export interface OrderTimelineEntry {
  status: OrderStatus
  note: string
  at: string
}

export interface OrderChatMessage {
  id: string
  senderRole: Role
  senderName: string
  body: string
  sentAt: string
}

export interface OrderSummary {
  id: string
  customerId: string
  customerName: string
  storeId: string
  storeName: string
  riderId?: string
  riderName?: string
  status: OrderStatus
  deliveryAddress: string
  scheduledDeliveryAt: string
  remark?: string
  items: Array<{
    menuItemId: string
    name: string
    quantity: number
    unitPriceCents: number
    refundedQuantity: number
  }>
  itemSubtotalCents: number
  deliveryFeeCents: number
  totalPriceCents: number
  createdAt: string
  updatedAt: string
  storeRating?: number
  riderRating?: number
  reviewComment?: string
  reviewExtraNote?: string
  storeReviewComment?: string
  storeReviewExtraNote?: string
  riderReviewComment?: string
  riderReviewExtraNote?: string
  merchantRejectReason?: string
  reviewStatus: ReviewStatus
  reviewRevokedReason?: string
  reviewRevokedAt?: string
  timeline: OrderTimelineEntry[]
  chatMessages: OrderChatMessage[]
  partialRefundRequests: OrderPartialRefundRequest[]
}

export interface OrderPartialRefundRequest {
  id: string
  orderId: string
  menuItemId: string
  itemName: string
  quantity: number
  reason: string
  status: PartialRefundStatus
  resolutionNote?: string
  submittedAt: string
  reviewedAt?: string
}

export interface ReviewAppeal {
  id: string
  orderId: string
  customerId: string
  customerName: string
  storeId: string
  riderId?: string
  appellantRole: AppealRole
  reason: string
  status: AppealStatus
  resolutionNote?: string
  submittedAt: string
  reviewedAt?: string
}

export interface EligibilityReview {
  id: string
  target: EligibilityReviewTarget
  targetId: string
  targetName: string
  reason: string
  status: AppealStatus
  resolutionNote?: string
  submittedAt: string
  reviewedAt?: string
}

export interface AdminTicket {
  id: string
  orderId: string
  kind: TicketKind
  status: TicketStatus
  summary: string
  resolutionNote?: string
  updatedAt: string
}

export interface SystemMetrics {
  totalOrders: number
  activeOrders: number
  resolvedTickets: number
  averageRating: number
}

export interface DeliveryAppState {
  customers: Customer[]
  stores: Store[]
  merchantProfiles: MerchantProfile[]
  riders: Rider[]
  admins: AdminProfile[]
  merchantApplications: MerchantApplication[]
  reviewAppeals: ReviewAppeal[]
  eligibilityReviews: EligibilityReview[]
  orders: OrderSummary[]
  tickets: AdminTicket[]
  metrics: SystemMetrics
}

export interface OrderItemInput {
  menuItemId: string
  quantity: number
}

export interface CreateOrderRequest {
  customerId: string
  storeId: string
  deliveryAddress: string
  scheduledDeliveryAt: string
  remark?: string
  items: OrderItemInput[]
}

export interface UpdateCustomerProfileRequest {
  name: string
}

export interface AddCustomerAddressRequest {
  label: string
  address: string
}

export interface RemoveCustomerAddressRequest {
  address: string
}

export interface SetDefaultCustomerAddressRequest {
  address: string
}

export interface RechargeBalanceRequest {
  amountCents: number
}

export interface UpdateMerchantProfileRequest {
  contactPhone: string
  payoutAccount: MerchantPayoutAccount
}

export interface WithdrawMerchantIncomeRequest {
  amountCents: number
}

export interface AssignRiderRequest {
  riderId: string
}

export interface RejectOrderRequest {
  reason: string
}

export interface MerchantRegistrationRequest {
  merchantName: string
  storeName: string
  category: StoreCategory
  businessHours: BusinessHours
  avgPrepMinutes: number
  imageUrl?: string
  note?: string
}

export interface AddMenuItemRequest {
  name: string
  description: string
  priceCents: number
  imageUrl?: string
  remainingQuantity?: number
}

export interface UpdateMenuItemStockRequest {
  remainingQuantity?: number
}

export interface UpdateStoreOperationalRequest {
  businessHours: BusinessHours
  avgPrepMinutes: number
}

export interface ImageUploadResponse {
  url: string
}

export interface ReviewMerchantApplicationRequest {
  reviewNote: string
}

export interface ReviewAppealRequest {
  appellantRole: AppealRole
  reason: string
}

export interface ResolveReviewAppealRequest {
  approved: boolean
  resolutionNote: string
}

export interface EligibilityReviewRequest {
  target: EligibilityReviewTarget
  targetId: string
  reason: string
}

export interface ResolveEligibilityReviewRequest {
  approved: boolean
  resolutionNote: string
}

export interface ReviewSubmission {
  rating: number
  comment?: string
  extraNote?: string
}

export interface ReviewOrderRequest {
  storeReview?: ReviewSubmission
  riderReview?: ReviewSubmission
}

export interface ResolveTicketRequest {
  resolution: string
  note: string
}

export interface SendOrderChatMessageRequest {
  body: string
}

export interface SubmitPartialRefundRequest {
  menuItemId: string
  quantity: number
  reason: string
}

export interface ResolvePartialRefundRequest {
  approved: boolean
  resolutionNote: string
}

export interface AuthUser {
  id: string
  username: string
  role: Role
  displayName: string
  linkedProfileId?: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  role: Exclude<Role, 'admin'>
}
