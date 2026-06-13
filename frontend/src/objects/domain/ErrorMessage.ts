import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ErrorMessageTag = { readonly errorMessageBrand: never }

export type ErrorMessage = TextDomainValue<ErrorMessageTag>
