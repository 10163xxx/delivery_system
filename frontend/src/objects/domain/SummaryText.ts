import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type SummaryTextTag = { readonly summaryTextBrand: never }

export type SummaryText = TextDomainValue<SummaryTextTag>
