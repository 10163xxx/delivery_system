// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { TextDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type EligibilityReviewIdTag = { readonly eligibilityReviewIdBrand: never }

export type EligibilityReviewId = TextDomainValue<EligibilityReviewIdTag>
