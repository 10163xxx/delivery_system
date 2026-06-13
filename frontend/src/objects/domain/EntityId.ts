import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type EntityIdTag = { readonly entityIdBrand: never }

export type EntityId = TextDomainValue<EntityIdTag>
