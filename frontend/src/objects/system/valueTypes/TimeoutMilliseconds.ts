// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { NumericDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type TimeoutMillisecondsTag = { readonly timeoutMillisecondsBrand: never }

export type TimeoutMilliseconds = NumericDomainValue<TimeoutMillisecondsTag>
