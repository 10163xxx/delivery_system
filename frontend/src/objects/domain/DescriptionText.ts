import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type DescriptionTextTag = { readonly descriptionTextBrand: never }

export type DescriptionText = TextDomainValue<DescriptionTextTag>
