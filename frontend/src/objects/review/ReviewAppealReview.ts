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
