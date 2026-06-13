import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type NoteTextTag = { readonly noteTextBrand: never }

export type NoteText = TextDomainValue<NoteTextTag>
