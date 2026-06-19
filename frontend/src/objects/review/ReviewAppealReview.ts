// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AppealStatus,
  IsoDateTime,
  ResolutionText,
} from '@/objects/core/SharedObjects'

export type ReviewAppealReview = {
  status: AppealStatus
  resolutionNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}
