import type { AppealRole, ReasonText } from '@/shared/object/domain/DomainObjects'

export type ReviewAppealRequest = {
  appellantRole: AppealRole
  reason: ReasonText
}
