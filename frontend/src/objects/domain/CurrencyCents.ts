import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type CurrencyCentsTag = { readonly currencyCentsBrand: never }

export type CurrencyCents = NumericDomainValue<CurrencyCentsTag>
