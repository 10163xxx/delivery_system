import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ZoneLabelTag = { readonly zoneLabelBrand: never }

export type ZoneLabel = TextDomainValue<ZoneLabelTag>
