import type { NoteText, RatingValue, ReasonText } from '@/objects/core/SharedObjects'

export type ReviewSubmission = {
  rating: RatingValue
  comment?: ReasonText
  extraNote?: NoteText
}
