// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type {
  AfterSalesResolutionMode,
  ApprovalFlag,
  CurrencyCents,
  ResolutionText,
} from '@/objects/core/SharedObjects'

export type ResolveAfterSalesRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
  resolutionMode?: AfterSalesResolutionMode
  actualCompensationCents?: CurrencyCents
  couponMinimumSpendCents?: CurrencyCents
}
