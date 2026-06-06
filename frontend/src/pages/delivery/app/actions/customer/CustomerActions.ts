import { createCustomerOrderActions } from '@/pages/delivery/app/actions/customer/order/CustomerOrderActions'
import { createCustomerProfileActions } from '@/pages/delivery/app/actions/customer/profile/CustomerProfileActions'
import { createCustomerRechargeActions } from '@/pages/delivery/app/actions/customer/profile/CustomerRechargeActions'
import { createCustomerSearchActions } from '@/pages/delivery/app/actions/customer/search/CustomerSearchActions'
import { createCustomerOrderIssueActions } from '@/pages/delivery/app/actions/customer/orderIssue/CustomerOrderIssueActions'
import type { CustomerActionContexts } from '@/pages/customer/objects/CustomerActionObjects'

export function createCustomerActions(contexts: CustomerActionContexts) {
  return {
    ...createCustomerSearchActions(contexts.search),
    ...createCustomerOrderActions(contexts.order),
    ...createCustomerOrderIssueActions(contexts.orderIssue),
    ...createCustomerProfileActions(contexts.profile),
    ...createCustomerRechargeActions(contexts.recharge),
  }
}
