import type {
  DisplayText,
  MenuItemId,
  OrderId,
  PartialRefundStatus,
  Quantity,
  RefundRequestId,
  ResolutionText,
  IsoDateTime,
  ReasonText,
} from '@/objects/domain/DomainObjects'

export type OrderPartialRefundRequestIdentity = {
  id: RefundRequestId
  orderId: OrderId
  menuItemId: MenuItemId
  itemName: DisplayText
}

export type OrderPartialRefundRequestDecision = {
  quantity: Quantity
  reason: ReasonText
}

export type OrderPartialRefundResolution = {
  status: PartialRefundStatus
  resolutionNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}

export type OrderPartialRefundRequest = OrderPartialRefundRequestIdentity &
  OrderPartialRefundRequestDecision & {
    resolution: OrderPartialRefundResolution
  } & OrderPartialRefundResolution
