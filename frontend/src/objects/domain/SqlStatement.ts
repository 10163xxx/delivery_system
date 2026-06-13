import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type SqlStatementTag = { readonly sqlStatementBrand: never }

export type SqlStatement = TextDomainValue<SqlStatementTag>
