import type { DisplayText, ResolutionText } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export const APPLICATION_REVIEW_DEFAULTS: Record<'approve' | 'reject', DisplayText> = {
  approve: asDomainText<DisplayText>('资料已核验'),
  reject: asDomainText<DisplayText>('资料不完整，请补充后重提'),
} as const

export const APPEAL_RESOLUTION_DEFAULTS: Record<'approve' | 'reject', ResolutionText> = {
  approve: asDomainText<ResolutionText>('申诉成立，已撤销评价'),
  reject: asDomainText<ResolutionText>('证据不足，维持原评价'),
} as const

export const ELIGIBILITY_RESOLUTION_DEFAULTS: Record<'approve' | 'reject', ResolutionText> = {
  approve: asDomainText<ResolutionText>('整改完成，恢复资格'),
  reject: asDomainText<ResolutionText>('复核未通过，维持当前限制'),
} as const
