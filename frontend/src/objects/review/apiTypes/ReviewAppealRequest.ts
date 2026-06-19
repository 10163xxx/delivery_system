// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { AppealRole, ReasonText } from '@/objects/core/SharedObjects'

export type ReviewAppealRequest = {
  appellantRole: AppealRole
  reason: ReasonText
}
