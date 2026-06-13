import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AddressTextTag = { readonly addressTextBrand: never }

export type AddressText = TextDomainValue<AddressTextTag>
