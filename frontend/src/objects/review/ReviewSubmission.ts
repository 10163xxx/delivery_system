import type { NoteText, RatingValue, ReasonText } from '@/objects/domain/DomainObjects'

export type ReviewSubmission = {
  rating: RatingValue
  comment?: ReasonText
  extraNote?: NoteText
}
