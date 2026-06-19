// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { Coupon } from '@/objects/customer/profile/Coupon'
import type {
  AfterSalesResolutionMode,
  ApprovalFlag,
  CurrencyCents,
  IsoDateTime,
  ResolutionText,
} from '@/objects/core/SharedObjects'

export type AdminTicketResolution = {
  actualCompensationCents?: CurrencyCents
  approved?: ApprovalFlag
  resolutionMode?: AfterSalesResolutionMode
  issuedCoupon?: Coupon
  resolutionNote?: ResolutionText
  reviewedAt?: IsoDateTime
}
