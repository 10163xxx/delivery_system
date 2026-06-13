import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type TimeOfDayTag = { readonly timeOfDayBrand: never }

export type TimeOfDay = TextDomainValue<TimeOfDayTag>
