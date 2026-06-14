import type {
  AppealRole,
  ReasonText,
} from '@/objects/core/SharedObjects'

export type ReviewAppealDecision = {
  appellantRole: AppealRole
  reason: ReasonText
}
