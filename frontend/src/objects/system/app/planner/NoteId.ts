// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { TextDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type NoteIdTag = { readonly noteIdBrand: never }

export type NoteId = TextDomainValue<NoteIdTag>
