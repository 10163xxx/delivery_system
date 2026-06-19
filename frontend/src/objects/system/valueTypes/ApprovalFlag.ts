// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { BooleanDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type ApprovalFlagTag = { readonly approvalFlagBrand: never }

export type ApprovalFlag = BooleanDomainValue<ApprovalFlagTag>
