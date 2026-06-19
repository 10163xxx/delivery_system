// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { ReviewAppealDecision } from '@/objects/review/ReviewAppealDecision'
import type { ReviewAppealIdentity } from '@/objects/review/ReviewAppealIdentity'
import type { ReviewAppealReview } from '@/objects/review/ReviewAppealReview'

export type { ReviewAppealDecision } from '@/objects/review/ReviewAppealDecision'
export type { ReviewAppealIdentity } from '@/objects/review/ReviewAppealIdentity'
export type { ReviewAppealReview } from '@/objects/review/ReviewAppealReview'

export type ReviewAppeal = ReviewAppealIdentity & ReviewAppealDecision & {
  identity: ReviewAppealIdentity
  decision: ReviewAppealDecision
  review: ReviewAppealReview
} & ReviewAppealReview
