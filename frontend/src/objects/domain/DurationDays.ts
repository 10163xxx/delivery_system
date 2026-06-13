import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type DurationDaysTag = { readonly durationDaysBrand: never }

export type DurationDays = NumericDomainValue<DurationDaysTag>
