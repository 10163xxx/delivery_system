// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { NoteText, RatingValue, ReasonText } from '@/objects/core/SharedObjects'

export type ReviewSubmission = {
  rating: RatingValue
  comment?: ReasonText
  extraNote?: NoteText
}
