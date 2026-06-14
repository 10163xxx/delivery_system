import type { AppealRole, ReasonText } from '@/objects/core/SharedObjects'

export type ReviewAppealRequest = {
  appellantRole: AppealRole
  reason: ReasonText
}
