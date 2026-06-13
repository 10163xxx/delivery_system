import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type NoteTitleTag = { readonly noteTitleBrand: never }

export type NoteTitle = TextDomainValue<NoteTitleTag>
