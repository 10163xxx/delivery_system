import type { AppealRole, ReasonText } from '@/objects/domain/DomainObjects'

export type ReviewAppealRequest = {
  appellantRole: AppealRole
  reason: ReasonText
}
