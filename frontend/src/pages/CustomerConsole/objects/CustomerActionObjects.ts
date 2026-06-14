export type { CustomerSearchParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerSearchActionObjects'
export type { CustomerRechargeParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerRechargeActionObjects'
export type { CustomerProfileParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerProfileActionObjects'
export type {
  CustomerOrderIssueParams,
  ReviewSubmissionValidationResult,
} from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerOrderIssueActionObjects'
export type {
  CustomerOrderActionParams,
  CustomerOrderDraftParams,
  CustomerOrderParams,
  CustomerOrderSelectionParams,
  OrderSubmissionValidationResult,
} from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerOrderActionObjects'

import type { CustomerSearchParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerSearchActionObjects'
import type { CustomerRechargeParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerRechargeActionObjects'
import type { CustomerProfileParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerProfileActionObjects'
import type { CustomerOrderIssueParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerOrderIssueActionObjects'
import type { CustomerOrderParams } from '@/pages/CustomerConsole/objects/customerActionObjects/CustomerOrderActionObjects'

export type CustomerActionContexts = {
  search: CustomerSearchParams
  recharge: CustomerRechargeParams
  profile: CustomerProfileParams
  orderIssue: CustomerOrderIssueParams
  order: CustomerOrderParams
}
