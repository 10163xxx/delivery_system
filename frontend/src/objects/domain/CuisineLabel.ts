import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type CuisineLabelTag = { readonly cuisineLabelBrand: never }

export type CuisineLabel = TextDomainValue<CuisineLabelTag>
