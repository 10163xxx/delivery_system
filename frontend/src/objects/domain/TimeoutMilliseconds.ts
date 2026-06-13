import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type TimeoutMillisecondsTag = { readonly timeoutMillisecondsBrand: never }

export type TimeoutMilliseconds = NumericDomainValue<TimeoutMillisecondsTag>
