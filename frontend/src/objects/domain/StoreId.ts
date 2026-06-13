import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type StoreIdTag = { readonly storeIdBrand: never }

export type StoreId = TextDomainValue<StoreIdTag>
