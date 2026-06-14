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
