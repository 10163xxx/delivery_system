// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { AdminTicket } from '@/objects/admin/afterSales/AdminTicket'
import type { OrderSummary } from '@/objects/order/core/OrderSummary'
import type {
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ResolveAfterSalesRequest,
} from '@/objects/core/SharedObjects'

export type AfterSalesResolutionContext = {
  request: ResolveAfterSalesRequest
  ticket: AdminTicket
  order: OrderSummary
  requestType: AfterSalesRequestType
  resolutionMode: AfterSalesResolutionMode
}
