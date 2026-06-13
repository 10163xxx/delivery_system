import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AddressLabelTag = { readonly addressLabelBrand: never }

export type AddressLabel = TextDomainValue<AddressLabelTag>
