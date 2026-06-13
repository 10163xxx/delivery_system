import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type EligibilityReviewIdTag = { readonly eligibilityReviewIdBrand: never }

export type EligibilityReviewId = TextDomainValue<EligibilityReviewIdTag>
