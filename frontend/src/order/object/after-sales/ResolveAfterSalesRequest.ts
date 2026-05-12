import type {
  AfterSalesResolutionMode,
  ApprovalFlag,
  CurrencyCents,
  ResolutionText,
} from '@/shared/object/domain/DomainObjects'

export type ResolveAfterSalesRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
  resolutionMode?: AfterSalesResolutionMode
  actualCompensationCents?: CurrencyCents
  couponMinimumSpendCents?: CurrencyCents
}
