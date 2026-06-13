import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ReasonTextTag = { readonly reasonTextBrand: never }

export type ReasonText = TextDomainValue<ReasonTextTag>
