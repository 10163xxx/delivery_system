import { createCustomerOrderActions } from '@/pages/CustomerConsole/functions/actions/order/CustomerOrderActions'
import { createCustomerProfileActions } from '@/pages/CustomerConsole/functions/actions/profile/CustomerProfileActions'
import { createCustomerRechargeActions } from '@/pages/CustomerConsole/functions/actions/profile/CustomerRechargeActions'
import { createCustomerSearchActions } from '@/pages/CustomerConsole/functions/actions/search/CustomerSearchActions'
import { createCustomerOrderIssueActions } from '@/pages/CustomerConsole/functions/actions/orderIssue/CustomerOrderIssueActions'
import type { CustomerActionContexts } from '@/pages/CustomerConsole/objects/CustomerActionObjects'

export function createCustomerActions(contexts: CustomerActionContexts) {
  return {
    ...createCustomerSearchActions(contexts.search),
    ...createCustomerOrderActions(contexts.order),
    ...createCustomerOrderIssueActions(contexts.orderIssue),
    ...createCustomerProfileActions(contexts.profile),
    ...createCustomerRechargeActions(contexts.recharge),
  }
}
