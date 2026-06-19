// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { TextDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type MerchantIdTag = { readonly merchantIdBrand: never }

export type MerchantId = TextDomainValue<MerchantIdTag>
