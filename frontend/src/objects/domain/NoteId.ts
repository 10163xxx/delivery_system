import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type NoteIdTag = { readonly noteIdBrand: never }

export type NoteId = TextDomainValue<NoteIdTag>
