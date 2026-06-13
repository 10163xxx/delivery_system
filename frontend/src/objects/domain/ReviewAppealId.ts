import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ReviewAppealIdTag = { readonly reviewAppealIdBrand: never }

export type ReviewAppealId = TextDomainValue<ReviewAppealIdTag>
