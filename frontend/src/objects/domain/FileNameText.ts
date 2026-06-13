import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type FileNameTextTag = { readonly fileNameTextBrand: never }

export type FileNameText = TextDomainValue<FileNameTextTag>
