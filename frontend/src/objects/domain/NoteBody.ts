import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type NoteBodyTag = { readonly noteBodyBrand: never }

export type NoteBody = TextDomainValue<NoteBodyTag>
