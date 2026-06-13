import type { BooleanDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ApprovalFlagTag = { readonly approvalFlagBrand: never }

export type ApprovalFlag = BooleanDomainValue<ApprovalFlagTag>
