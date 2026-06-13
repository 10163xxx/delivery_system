import { createCustomerOrderActions } from '@/pages/DeliveryConsole/functions/customer/order/CustomerOrderActions'
import { createCustomerProfileActions } from '@/pages/DeliveryConsole/functions/customer/profile/CustomerProfileActions'
import { createCustomerRechargeActions } from '@/pages/DeliveryConsole/functions/customer/profile/CustomerRechargeActions'
import { createCustomerSearchActions } from '@/pages/DeliveryConsole/functions/customer/search/CustomerSearchActions'
import { createCustomerOrderIssueActions } from '@/pages/DeliveryConsole/functions/customer/orderIssue/CustomerOrderIssueActions'
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
