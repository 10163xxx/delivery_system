import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type DisplayTextTag = { readonly displayTextBrand: never }

export type DisplayText = TextDomainValue<DisplayTextTag>
