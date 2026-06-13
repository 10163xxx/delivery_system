import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PlannerNameTag = { readonly plannerNameBrand: never }

export type PlannerName = TextDomainValue<PlannerNameTag>
