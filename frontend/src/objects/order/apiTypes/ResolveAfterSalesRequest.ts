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
