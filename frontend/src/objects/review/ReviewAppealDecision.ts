// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AppealRole,
  ReasonText,
} from '@/objects/core/SharedObjects'

export type ReviewAppealDecision = {
  appellantRole: AppealRole
  reason: ReasonText
}
