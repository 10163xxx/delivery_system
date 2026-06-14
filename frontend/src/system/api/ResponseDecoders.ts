import type {
  AdminTicket,
  AdminTicketIdentity,
  AdminTicketLifecycle,
  AdminTicketResolution,
  AdminTicketSubmission,
} from '@/objects/admin/afterSales/AdminTicket'
import type { AdminProfile } from '@/objects/admin/profile/AdminProfile'
import type { AuthSession } from '@/objects/auth/AuthSession'
import type { AuthAccount } from '@/objects/auth/AuthAccount'
import type { AddressEntry } from '@/objects/customer/profile/AddressEntry'
import type { Coupon } from '@/objects/customer/profile/Coupon'
import type { Customer, CustomerLocation, CustomerMetrics } from '@/objects/customer/profile/Customer'
import type { MerchantApplication, MerchantApplicationReview } from '@/objects/merchant/application/MerchantApplication'
import type { ImageUploadResponse } from '@/objects/merchant/apiTypes/ImageUploadResponse'
import type { MenuItem } from '@/objects/merchant/menu/MenuItem'
import type { MenuItemSelectionGroup } from '@/objects/merchant/menu/MenuItemSelectionGroup'
import type { MenuItemSelectionOption } from '@/objects/merchant/menu/MenuItemSelectionOption'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'
import type { MerchantProfile } from '@/objects/merchant/profile/MerchantProfile'
import type { MerchantWithdrawal } from '@/objects/merchant/profile/MerchantWithdrawal'
import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'
import type { Store, StoreLocation, StoreMetrics, StoreOperations } from '@/objects/merchant/store/Store'
import type { OrderPartialRefundRequest, OrderPartialRefundResolution } from '@/objects/order/afterSales/OrderPartialRefundRequest'
import type { OrderChatMessage } from '@/objects/order/core/OrderChatMessage'
import type { OrderItemSelection } from '@/objects/order/core/OrderItemSelection'
import type { OrderLineItem } from '@/objects/order/core/OrderLineItem'
import type {
  OrderSummary,
  OrderSummaryActivity,
  OrderSummaryFulfillment,
  OrderSummaryIdentity,
  OrderSummaryLifecycle,
  OrderSummaryPricing,
  OrderSummaryReviewContent,
  OrderSummaryReviewState,
} from '@/objects/order/core/OrderSummary'
import type { OrderTimelineEntry } from '@/objects/order/core/OrderTimelineEntry'
import type { EligibilityReview } from '@/objects/review/EligibilityReview'
import type {
  ReviewAppeal,
  ReviewAppealDecision,
  ReviewAppealIdentity,
  ReviewAppealReview,
} from '@/objects/review/ReviewAppeal'
import type {
  Rider,
  RiderIdentity,
  RiderPayout,
  RiderPerformance,
} from '@/objects/rider/profile/Rider'
import type { DeliveryAppState } from '@/objects/domain/DeliveryAppState'
import type { SystemMetrics } from '@/objects/domain/SystemMetrics'
import type {
  AddressText,
  DemoNote,
  EchoResponse,
  HealthResponse,
} from '@/objects/core/SharedObjects'
import {
  decodeAfterSalesRequestType,
  decodeAfterSalesResolutionMode,
  decodeAccountStatus,
  decodeAppealRole,
  decodeAppealStatus,
  decodeApplicationStatus,
  decodeAvailability,
  decodeEligibilityReviewTarget,
  decodeMembershipTier,
  decodeNoteStatus,
  decodeOrderStatus,
  decodePartialRefundStatus,
  decodePayoutAccountType,
  decodeReviewStatus,
  decodeRole,
  decodeStoreCategory,
  decodeStoreStatus,
  decodeTicketKind,
  decodeTicketStatus,
} from '@/system/api/DecoderEnums'
import {
  decodeArray,
  decodeBoolean,
  decodeField,
  decodeNumber,
  decodeOptionalArrayField,
  decodeOptionalField,
  decodeString,
  fail,
  type Decoder,
} from '@/system/api/DecoderSupport'

export type { Decoder } from '@/system/api/DecoderSupport'

const decodeAddressEntry: Decoder<AddressEntry> = (value, path = '$') => ({ label: decodeField(value, path, 'label', decodeString), address: decodeField(value, path, 'address', decodeString), location: decodeOptionalField(value, path, 'location', decodeCustomerLocation) })
const decodeAddressText: Decoder<AddressText> = (value, path = '$') => decodeString(value, path)
const decodeCoupon: Decoder<Coupon> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), title: decodeField(value, path, 'title', decodeString), discountCents: decodeField(value, path, 'discountCents', decodeNumber), minimumSpendCents: decodeField(value, path, 'minimumSpendCents', decodeNumber), description: decodeField(value, path, 'description', decodeString), expiresAt: decodeField(value, path, 'expiresAt', decodeString) })
const decodeBusinessHours: Decoder<BusinessHours> = (value, path = '$') => ({ openTime: decodeField(value, path, 'openTime', decodeString), closeTime: decodeField(value, path, 'closeTime', decodeString) })
const decodeStoreLocation: Decoder<StoreLocation> = (value, path = '$') => ({ latitude: decodeField(value, path, 'latitude', decodeNumber), longitude: decodeField(value, path, 'longitude', decodeNumber) })
const decodeCustomerLocation: Decoder<CustomerLocation> = (value, path = '$') => ({ latitude: decodeField(value, path, 'latitude', decodeNumber), longitude: decodeField(value, path, 'longitude', decodeNumber) })
const decodeSelectionOption: Decoder<MenuItemSelectionOption> = (value, path = '$') => ({ name: decodeField(value, path, 'name', decodeString), additionalPriceCents: decodeField(value, path, 'additionalPriceCents', decodeNumber) })
const decodeSelectionGroup: Decoder<MenuItemSelectionGroup> = (value, path = '$') => ({ name: decodeField(value, path, 'name', decodeString), minSelections: decodeField(value, path, 'minSelections', decodeNumber), maxSelections: decodeField(value, path, 'maxSelections', decodeNumber), options: decodeField(value, path, 'options', (entry, entryPath) => decodeArray(entry, entryPath, decodeSelectionOption)) })
const decodeMenuItem: Decoder<MenuItem> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), name: decodeField(value, path, 'name', decodeString), category: decodeOptionalField(value, path, 'category', decodeString), description: decodeField(value, path, 'description', decodeString), priceCents: decodeField(value, path, 'priceCents', decodeNumber), imageUrl: decodeOptionalField(value, path, 'imageUrl', decodeString), remainingQuantity: decodeOptionalField(value, path, 'remainingQuantity', decodeNumber), selectionGroups: decodeOptionalArrayField(value, path, 'selectionGroups', decodeSelectionGroup) })
const decodeMerchantWithdrawal: Decoder<MerchantWithdrawal> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), amountCents: decodeField(value, path, 'amountCents', decodeNumber), accountLabel: decodeField(value, path, 'accountLabel', decodeString), requestedAt: decodeField(value, path, 'requestedAt', decodeString) })
const decodeMerchantPayoutAccount: Decoder<MerchantPayoutAccount> = (value, path = '$') => ({ accountType: decodeField(value, path, 'accountType', decodePayoutAccountType), bankName: decodeOptionalField(value, path, 'bankName', decodeString), accountNumber: decodeField(value, path, 'accountNumber', decodeString), accountHolder: decodeField(value, path, 'accountHolder', decodeString) })
const decodeCustomer: Decoder<Customer> = (value, path = '$') => {
  const metrics: CustomerMetrics = { revokedReviewCount: decodeField(value, path, 'revokedReviewCount', decodeNumber), membershipTier: decodeField(value, path, 'membershipTier', decodeMembershipTier), monthlySpendCents: decodeField(value, path, 'monthlySpendCents', decodeNumber), balanceCents: decodeField(value, path, 'balanceCents', decodeNumber), coupons: decodeField(value, path, 'coupons', (entry, entryPath) => decodeArray(entry, entryPath, decodeCoupon)) }
  return { id: decodeField(value, path, 'id', decodeString), name: decodeField(value, path, 'name', decodeString), phone: decodeField(value, path, 'phone', decodeString), defaultAddress: decodeField(value, path, 'defaultAddress', decodeString), location: decodeOptionalField(value, path, 'location', decodeCustomerLocation), addresses: decodeField(value, path, 'addresses', (entry, entryPath) => decodeArray(entry, entryPath, decodeAddressEntry)), accountStatus: decodeField(value, path, 'accountStatus', decodeAccountStatus), ...metrics, metrics }
}
const decodeMerchantProfile: Decoder<MerchantProfile> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), merchantName: decodeField(value, path, 'merchantName', decodeString), contactPhone: decodeField(value, path, 'contactPhone', decodeString), payoutAccount: decodeOptionalField(value, path, 'payoutAccount', decodeMerchantPayoutAccount), settledIncomeCents: decodeField(value, path, 'settledIncomeCents', decodeNumber), withdrawnCents: decodeField(value, path, 'withdrawnCents', decodeNumber), availableToWithdrawCents: decodeField(value, path, 'availableToWithdrawCents', decodeNumber), withdrawalHistory: decodeField(value, path, 'withdrawalHistory', (entry, entryPath) => decodeArray(entry, entryPath, decodeMerchantWithdrawal)) })
const decodeRider: Decoder<Rider> = (value, path = '$') => {
  const identity: RiderIdentity = { id: decodeField(value, path, 'id', decodeString), name: decodeField(value, path, 'name', decodeString), vehicle: decodeField(value, path, 'vehicle', decodeString), zone: decodeField(value, path, 'zone', decodeString), availability: decodeField(value, path, 'availability', decodeAvailability) }
  const performance: RiderPerformance = { averageRating: decodeField(value, path, 'averageRating', decodeNumber), ratingCount: decodeField(value, path, 'ratingCount', decodeNumber), oneStarRatingCount: decodeField(value, path, 'oneStarRatingCount', decodeNumber), earningsCents: decodeField(value, path, 'earningsCents', decodeNumber) }
  const payout: RiderPayout = { payoutAccount: decodeOptionalField(value, path, 'payoutAccount', decodeMerchantPayoutAccount), withdrawnCents: decodeField(value, path, 'withdrawnCents', decodeNumber), availableToWithdrawCents: decodeField(value, path, 'availableToWithdrawCents', decodeNumber), withdrawalHistory: decodeField(value, path, 'withdrawalHistory', (entry, entryPath) => decodeArray(entry, entryPath, decodeMerchantWithdrawal)) }
  return { ...identity, ...performance, ...payout, identity, performance, payout }
}
const decodeAdminProfile: Decoder<AdminProfile> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), name: decodeField(value, path, 'name', decodeString), platformIncomeCents: decodeField(value, path, 'platformIncomeCents', decodeNumber) })
const decodeStore: Decoder<Store> = (value, path = '$') => {
  const operations: StoreOperations = { status: decodeField(value, path, 'status', decodeStoreStatus), storeAddress: decodeOptionalField(value, path, 'storeAddress', decodeAddressText) ?? decodeAddressText('', `${path}.storeAddress`), location: decodeOptionalField(value, path, 'location', decodeStoreLocation), businessHours: decodeField(value, path, 'businessHours', decodeBusinessHours), avgPrepMinutes: decodeField(value, path, 'avgPrepMinutes', decodeNumber), imageUrl: decodeOptionalField(value, path, 'imageUrl', decodeString), menu: decodeField(value, path, 'menu', (entry, entryPath) => decodeArray(entry, entryPath, decodeMenuItem)) }
  const metrics: StoreMetrics = { averageRating: decodeField(value, path, 'averageRating', decodeNumber), ratingCount: decodeField(value, path, 'ratingCount', decodeNumber), oneStarRatingCount: decodeField(value, path, 'oneStarRatingCount', decodeNumber), revenueCents: decodeField(value, path, 'revenueCents', decodeNumber) }
  return { id: decodeField(value, path, 'id', decodeString), merchantName: decodeField(value, path, 'merchantName', decodeString), name: decodeField(value, path, 'name', decodeString), category: decodeField(value, path, 'category', decodeStoreCategory), cuisine: decodeField(value, path, 'cuisine', decodeString), ...operations, ...metrics, operations, metrics }
}
const decodeMerchantApplication: Decoder<MerchantApplication> = (value, path = '$') => {
  const review: MerchantApplicationReview = { status: decodeField(value, path, 'status', decodeApplicationStatus), reviewNote: decodeOptionalField(value, path, 'reviewNote', decodeString), submittedAt: decodeField(value, path, 'submittedAt', decodeString), reviewedAt: decodeOptionalField(value, path, 'reviewedAt', decodeString) }
  return { id: decodeField(value, path, 'id', decodeString), merchantName: decodeField(value, path, 'merchantName', decodeString), storeName: decodeField(value, path, 'storeName', decodeString), category: decodeField(value, path, 'category', decodeStoreCategory), storeAddress: decodeOptionalField(value, path, 'storeAddress', decodeAddressText) ?? decodeAddressText('', `${path}.storeAddress`), location: decodeOptionalField(value, path, 'location', decodeStoreLocation), businessHours: decodeField(value, path, 'businessHours', decodeBusinessHours), avgPrepMinutes: decodeField(value, path, 'avgPrepMinutes', decodeNumber), imageUrl: decodeOptionalField(value, path, 'imageUrl', decodeString), note: decodeOptionalField(value, path, 'note', decodeString), ...review, review }
}
const decodeReviewAppeal: Decoder<ReviewAppeal> = (value, path = '$') => {
  const identity: ReviewAppealIdentity = { id: decodeField(value, path, 'id', decodeString), orderId: decodeField(value, path, 'orderId', decodeString), customerId: decodeField(value, path, 'customerId', decodeString), customerName: decodeField(value, path, 'customerName', decodeString), storeId: decodeField(value, path, 'storeId', decodeString), riderId: decodeOptionalField(value, path, 'riderId', decodeString) }
  const decision: ReviewAppealDecision = { appellantRole: decodeField(value, path, 'appellantRole', decodeAppealRole), reason: decodeField(value, path, 'reason', decodeString) }
  const review: ReviewAppealReview = { status: decodeField(value, path, 'status', decodeAppealStatus), resolutionNote: decodeOptionalField(value, path, 'resolutionNote', decodeString), submittedAt: decodeField(value, path, 'submittedAt', decodeString), reviewedAt: decodeOptionalField(value, path, 'reviewedAt', decodeString) }
  return { ...identity, ...decision, ...review, identity, decision, review }
}
const decodeEligibilityReview: Decoder<EligibilityReview> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), target: decodeField(value, path, 'target', decodeEligibilityReviewTarget), targetId: decodeField(value, path, 'targetId', decodeString), targetName: decodeField(value, path, 'targetName', decodeString), reason: decodeField(value, path, 'reason', decodeString), status: decodeField(value, path, 'status', decodeAppealStatus), resolutionNote: decodeOptionalField(value, path, 'resolutionNote', decodeString), submittedAt: decodeField(value, path, 'submittedAt', decodeString), reviewedAt: decodeOptionalField(value, path, 'reviewedAt', decodeString) })
const decodeItemSelection: Decoder<OrderItemSelection> = (value, path = '$') => ({ groupName: decodeField(value, path, 'groupName', decodeString), selectedOptions: decodeField(value, path, 'selectedOptions', (entry, entryPath) => decodeArray(entry, entryPath, decodeString)) })
const decodeLineItem: Decoder<OrderLineItem> = (value, path = '$') => ({ menuItemId: decodeField(value, path, 'menuItemId', decodeString), name: decodeField(value, path, 'name', decodeString), quantity: decodeField(value, path, 'quantity', decodeNumber), unitPriceCents: decodeField(value, path, 'unitPriceCents', decodeNumber), refundedQuantity: decodeField(value, path, 'refundedQuantity', decodeNumber), selections: decodeOptionalArrayField(value, path, 'selections', decodeItemSelection) })
const decodeTimelineEntry: Decoder<OrderTimelineEntry> = (value, path = '$') => ({ status: decodeField(value, path, 'status', decodeOrderStatus), note: decodeField(value, path, 'note', decodeString), at: decodeField(value, path, 'at', decodeString) })
const decodeChatMessage: Decoder<OrderChatMessage> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), senderRole: decodeField(value, path, 'senderRole', decodeRole), senderName: decodeField(value, path, 'senderName', decodeString), body: decodeField(value, path, 'body', decodeString), sentAt: decodeField(value, path, 'sentAt', decodeString) })
const decodePartialRefundRequest: Decoder<OrderPartialRefundRequest> = (value, path = '$') => {
  const resolution: OrderPartialRefundResolution = { status: decodeField(value, path, 'status', decodePartialRefundStatus), resolutionNote: decodeOptionalField(value, path, 'resolutionNote', decodeString), submittedAt: decodeField(value, path, 'submittedAt', decodeString), reviewedAt: decodeOptionalField(value, path, 'reviewedAt', decodeString) }
  return { id: decodeField(value, path, 'id', decodeString), orderId: decodeField(value, path, 'orderId', decodeString), menuItemId: decodeField(value, path, 'menuItemId', decodeString), itemName: decodeField(value, path, 'itemName', decodeString), quantity: decodeField(value, path, 'quantity', decodeNumber), reason: decodeField(value, path, 'reason', decodeString), ...resolution, resolution }
}
const decodeOrderSummary: Decoder<OrderSummary> = (value, path = '$') => {
  const identity: OrderSummaryIdentity = { id: decodeField(value, path, 'id', decodeString), customerId: decodeField(value, path, 'customerId', decodeString), customerName: decodeField(value, path, 'customerName', decodeString), storeId: decodeField(value, path, 'storeId', decodeString), storeName: decodeField(value, path, 'storeName', decodeString), riderId: decodeOptionalField(value, path, 'riderId', decodeString), riderName: decodeOptionalField(value, path, 'riderName', decodeString) }
  const fulfillment: OrderSummaryFulfillment = { status: decodeField(value, path, 'status', decodeOrderStatus), deliveryAddress: decodeField(value, path, 'deliveryAddress', decodeString), scheduledDeliveryAt: decodeField(value, path, 'scheduledDeliveryAt', decodeString), remark: decodeOptionalField(value, path, 'remark', decodeString), items: decodeField(value, path, 'items', (entry, entryPath) => decodeArray(entry, entryPath, decodeLineItem)) }
  const pricing: OrderSummaryPricing = { itemSubtotalCents: decodeField(value, path, 'itemSubtotalCents', decodeNumber), deliveryFeeCents: decodeField(value, path, 'deliveryFeeCents', decodeNumber), couponDiscountCents: decodeField(value, path, 'couponDiscountCents', decodeNumber), appliedCoupon: decodeOptionalField(value, path, 'appliedCoupon', decodeCoupon), totalPriceCents: decodeField(value, path, 'totalPriceCents', decodeNumber) }
  const lifecycle: OrderSummaryLifecycle = { createdAt: decodeField(value, path, 'createdAt', decodeString), updatedAt: decodeField(value, path, 'updatedAt', decodeString) }
  const reviewState: OrderSummaryReviewState = { storeRating: decodeOptionalField(value, path, 'storeRating', decodeNumber), riderRating: decodeOptionalField(value, path, 'riderRating', decodeNumber), merchantRejectReason: decodeOptionalField(value, path, 'merchantRejectReason', decodeString), reviewStatus: decodeField(value, path, 'reviewStatus', decodeReviewStatus), reviewRevokedReason: decodeOptionalField(value, path, 'reviewRevokedReason', decodeString), reviewRevokedAt: decodeOptionalField(value, path, 'reviewRevokedAt', decodeString) }
  const reviewContent: OrderSummaryReviewContent = { reviewComment: decodeOptionalField(value, path, 'reviewComment', decodeString), reviewExtraNote: decodeOptionalField(value, path, 'reviewExtraNote', decodeString), storeReviewComment: decodeOptionalField(value, path, 'storeReviewComment', decodeString), storeReviewExtraNote: decodeOptionalField(value, path, 'storeReviewExtraNote', decodeString), storeMerchantReply: decodeOptionalField(value, path, 'storeMerchantReply', decodeString), storeMerchantReplyAt: decodeOptionalField(value, path, 'storeMerchantReplyAt', decodeString), riderReviewComment: decodeOptionalField(value, path, 'riderReviewComment', decodeString), riderReviewExtraNote: decodeOptionalField(value, path, 'riderReviewExtraNote', decodeString) }
  const activity: OrderSummaryActivity = { timeline: decodeField(value, path, 'timeline', (entry, entryPath) => decodeArray(entry, entryPath, decodeTimelineEntry)), chatMessages: decodeField(value, path, 'chatMessages', (entry, entryPath) => decodeArray(entry, entryPath, decodeChatMessage)), partialRefundRequests: decodeField(value, path, 'partialRefundRequests', (entry, entryPath) => decodeArray(entry, entryPath, decodePartialRefundRequest)) }
  return { ...identity, ...fulfillment, ...pricing, ...lifecycle, ...reviewState, ...reviewContent, ...activity, identity, fulfillment, pricing, lifecycle, reviewState, reviewContent, activity }
}
const decodeAdminTicket: Decoder<AdminTicket> = (value, path = '$') => {
  const identity: AdminTicketIdentity = { id: decodeField(value, path, 'id', decodeString), orderId: decodeField(value, path, 'orderId', decodeString), kind: decodeField(value, path, 'kind', decodeTicketKind), status: decodeField(value, path, 'status', decodeTicketStatus), summary: decodeField(value, path, 'summary', decodeString) }
  const submission: AdminTicketSubmission = { requestType: decodeOptionalField(value, path, 'requestType', decodeAfterSalesRequestType), submittedByRole: decodeOptionalField(value, path, 'submittedByRole', decodeRole), submittedByName: decodeOptionalField(value, path, 'submittedByName', decodeString), expectedCompensationCents: decodeOptionalField(value, path, 'expectedCompensationCents', decodeNumber), submittedAt: decodeField(value, path, 'submittedAt', decodeString) }
  const resolution: AdminTicketResolution = { actualCompensationCents: decodeOptionalField(value, path, 'actualCompensationCents', decodeNumber), approved: decodeOptionalField(value, path, 'approved', decodeBoolean), resolutionMode: decodeOptionalField(value, path, 'resolutionMode', decodeAfterSalesResolutionMode), issuedCoupon: decodeOptionalField(value, path, 'issuedCoupon', decodeCoupon), resolutionNote: decodeOptionalField(value, path, 'resolutionNote', decodeString), reviewedAt: decodeOptionalField(value, path, 'reviewedAt', decodeString) }
  const lifecycle: AdminTicketLifecycle = { updatedAt: decodeField(value, path, 'updatedAt', decodeString) }
  return { ...identity, ...submission, ...resolution, ...lifecycle, identity, submission, resolution, lifecycle }
}
const decodeSystemMetrics: Decoder<SystemMetrics> = (value, path = '$') => ({ totalOrders: decodeField(value, path, 'totalOrders', decodeNumber), activeOrders: decodeField(value, path, 'activeOrders', decodeNumber), resolvedTickets: decodeField(value, path, 'resolvedTickets', decodeNumber), averageRating: decodeField(value, path, 'averageRating', decodeNumber) })

export const decodeAuthAccount: Decoder<AuthAccount> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), username: decodeField(value, path, 'username', decodeString), role: decodeField(value, path, 'role', decodeRole), displayName: decodeField(value, path, 'displayName', decodeString), linkedProfileId: decodeOptionalField(value, path, 'linkedProfileId', decodeString), createdAt: decodeField(value, path, 'createdAt', decodeString) })
export const decodeAuthSession: Decoder<AuthSession> = (value, path = '$') => ({ token: decodeField(value, path, 'token', decodeString), user: decodeField(value, path, 'user', decodeAuthAccount) })
export const decodeHealthResponse: Decoder<HealthResponse> = (value, path = '$') => ({ status: decodeField(value, path, 'status', decodeString), service: decodeField(value, path, 'service', decodeString) })
export const decodeEchoResponse: Decoder<EchoResponse> = (value, path = '$') => ({ message: decodeField(value, path, 'message', decodeString), transformed: decodeField(value, path, 'transformed', decodeBoolean) })
export const decodeDemoNote: Decoder<DemoNote> = (value, path = '$') => ({ id: decodeField(value, path, 'id', decodeString), title: decodeField(value, path, 'title', decodeString), body: decodeField(value, path, 'body', decodeString), status: decodeField(value, path, 'status', decodeNoteStatus), createdAt: decodeField(value, path, 'createdAt', decodeString) })
export const decodeImageUploadResponse: Decoder<ImageUploadResponse> = (value, path = '$') => ({ url: decodeField(value, path, 'url', decodeString) })
export const decodeStringArray: Decoder<string[]> = (value, path = '$') => decodeArray(value, path, decodeString)
export const decodeVoid: Decoder<void> = (value, path = '$') => {
  if (value !== undefined) fail(path, 'expected empty response')
}
export const decodeDeliveryAppState: Decoder<DeliveryAppState> = (value, path = '$') => {
  const customers = decodeField<DeliveryAppState['customers']>(value, path, 'customers', (entry, entryPath) => decodeArray(entry, entryPath, decodeCustomer))
  const merchantProfiles = decodeField<DeliveryAppState['merchantProfiles']>(value, path, 'merchantProfiles', (entry, entryPath) => decodeArray(entry, entryPath, decodeMerchantProfile))
  const riders = decodeField<DeliveryAppState['riders']>(value, path, 'riders', (entry, entryPath) => decodeArray(entry, entryPath, decodeRider))
  const admins = decodeField<DeliveryAppState['admins']>(value, path, 'admins', (entry, entryPath) => decodeArray(entry, entryPath, decodeAdminProfile))
  const stores = decodeField<DeliveryAppState['stores']>(value, path, 'stores', (entry, entryPath) => decodeArray(entry, entryPath, decodeStore))
  const merchantApplications = decodeField<DeliveryAppState['merchantApplications']>(value, path, 'merchantApplications', (entry, entryPath) => decodeArray(entry, entryPath, decodeMerchantApplication))
  const reviewAppeals = decodeField<DeliveryAppState['reviewAppeals']>(value, path, 'reviewAppeals', (entry, entryPath) => decodeArray(entry, entryPath, decodeReviewAppeal))
  const eligibilityReviews = decodeField<DeliveryAppState['eligibilityReviews']>(value, path, 'eligibilityReviews', (entry, entryPath) => decodeArray(entry, entryPath, decodeEligibilityReview))
  const orders = decodeField<DeliveryAppState['orders']>(value, path, 'orders', (entry, entryPath) => decodeArray(entry, entryPath, decodeOrderSummary))
  const tickets = decodeField<DeliveryAppState['tickets']>(value, path, 'tickets', (entry, entryPath) => decodeArray(entry, entryPath, decodeAdminTicket))
  const metrics = decodeField<DeliveryAppState['metrics']>(value, path, 'metrics', decodeSystemMetrics)
  return { customers, merchantProfiles, riders, admins, stores, merchantApplications, reviewAppeals, eligibilityReviews, orders, tickets, metrics, deliveryState: { orders, tickets, metrics } }
}
