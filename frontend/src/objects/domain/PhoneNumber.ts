import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PhoneNumberTag = { readonly phoneNumberBrand: never }

export type PhoneNumber = TextDomainValue<PhoneNumberTag>
