import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type FileExtensionTag = { readonly fileExtensionBrand: never }

export type FileExtension = TextDomainValue<FileExtensionTag>
