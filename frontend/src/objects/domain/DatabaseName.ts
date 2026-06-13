import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type DatabaseNameTag = { readonly databaseNameBrand: never }

export type DatabaseName = TextDomainValue<DatabaseNameTag>
