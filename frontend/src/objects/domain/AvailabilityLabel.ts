import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AvailabilityLabelTag = { readonly availabilityLabelBrand: never }

export type AvailabilityLabel = TextDomainValue<AvailabilityLabelTag>
