import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type MinutesTag = { readonly minutesBrand: never }

export type Minutes = NumericDomainValue<MinutesTag>
