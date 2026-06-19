// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { TextDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type FileNameTextTag = { readonly fileNameTextBrand: never }

export type FileNameText = TextDomainValue<FileNameTextTag>
