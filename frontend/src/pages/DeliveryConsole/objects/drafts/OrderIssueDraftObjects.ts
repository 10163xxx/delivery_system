import type {
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ApprovalFlag,
  DisplayText,
  MenuItemId,
  OrderId,
  Quantity,
  ReasonText,
  ResolutionText,
} from '@/objects/core/SharedObjects'

export type AppealResolutionDraft = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}

export type PartialRefundDraft = {
  quantity: Quantity
  reason: ReasonText
}

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

export function buildPartialRefundDraftKey(
  orderId: OrderId,
  menuItemId: MenuItemId,
): PartialRefundDraftKey {
  return `${orderId}-${menuItemId}`
}
