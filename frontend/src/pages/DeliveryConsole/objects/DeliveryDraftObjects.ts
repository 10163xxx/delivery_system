import type {
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ApprovalFlag,
  DescriptionText,
  DisplayText,
  ImageUrl,
  MenuItemId,
  Minutes,
  NoteText,
  OrderId,
  PersonName,
  Quantity,
  RatingValue,
  ReasonText,
  ResolutionText,
  StoreCategory,
  TimeOfDay,
} from '@/objects/core/SharedObjects'
import type { MenuItemSelectionGroup, OrderItemSelection } from '@/objects/core/SharedObjects'
import { REVIEW_TARGET } from '@/pages/DeliveryConsole/objects/ReviewTargetObjects'
import type { AddressText } from '@/objects/core/SharedObjects'

// Frontend-only draft marker for an intentionally empty select value.
export type EmptySelection = DisplayText

export type ReviewDraft = {
  rating: RatingValue
  comment: ReasonText
  extraNote: NoteText
}

type MerchantIdentityDraft = {
  merchantName: PersonName
  storeName: DisplayText
  category: StoreCategory | EmptySelection
  storeAddress: AddressText
}

type MerchantScheduleDraft = {
  openTime: TimeOfDay
  closeTime: TimeOfDay
  avgPrepMinutes: Minutes
}

type MerchantAssetDraft = {
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  note: NoteText
}

export type MerchantDraft = MerchantIdentityDraft & MerchantScheduleDraft & MerchantAssetDraft

export type AppealResolutionDraft = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}

type MenuItemContentDraft = {
  name: DisplayText
  category: DisplayText
  description: DescriptionText
}

type MenuItemPricingDraft = {
  priceYuan: DisplayText
  remainingQuantity: DisplayText
}

type MenuItemAssetDraft = {
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  selectionGroupsText: DisplayText
}

export type MenuItemDraft = MenuItemContentDraft & MenuItemPricingDraft & MenuItemAssetDraft

export type SelectedMenuItemConfiguration = {
  selections: OrderItemSelection[]
  summaryText: DisplayText
}

export type MenuItemConfigurationModalState = {
  itemId: MenuItemId
  quantityAfterConfirm: Quantity
  draftSelections: Record<DisplayText, DisplayText[]>
  errorText: DisplayText | null
}

export type ParsedMenuItemSelectionGroups = {
  groups: MenuItemSelectionGroup[]
  errorText: DisplayText | null
}

export type PartialRefundDraft = {
  quantity: Quantity
  reason: ReasonText
}

export type ReviewTargetValue = (typeof REVIEW_TARGET)[keyof typeof REVIEW_TARGET]
export type ReviewDraftKey = `${OrderId}-${ReviewTargetValue}`
export type PartialRefundDraftKey = `${OrderId}-${MenuItemId}`

export type AfterSalesDraft = {
  requestType: AfterSalesRequestType
  reason: ReasonText
  expectedCompensationYuan: DisplayText
}

export type AfterSalesResolutionDraft = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
  resolutionMode: AfterSalesResolutionMode
  actualCompensationYuan: DisplayText
}

export function buildReviewDraftKey(
  orderId: OrderId,
  target: ReviewTargetValue,
): ReviewDraftKey {
  return `${orderId}-${target}`
}

export function buildPartialRefundDraftKey(
  orderId: OrderId,
  menuItemId: MenuItemId,
): PartialRefundDraftKey {
  return `${orderId}-${menuItemId}`
}
