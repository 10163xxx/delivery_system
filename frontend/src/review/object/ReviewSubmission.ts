import type {
  DescriptionText,
  RatingValue,
  ResolutionText,
} from '@/shared/object/domain/DomainObjects'

export type ReviewSubmission = {
  rating: RatingValue
  comment?: DescriptionText
  extraNote?: ResolutionText
}
