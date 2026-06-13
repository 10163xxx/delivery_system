import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type VehicleLabelTag = { readonly vehicleLabelBrand: never }

export type VehicleLabel = TextDomainValue<VehicleLabelTag>
