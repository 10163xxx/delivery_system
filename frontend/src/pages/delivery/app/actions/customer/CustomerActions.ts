import { createCustomerOrderActions } from '@/pages/delivery/app/actions/customer/order/CustomerOrderActions'
import { createCustomerProfileActions } from '@/pages/delivery/app/actions/customer/profile/CustomerProfileActions'
import { createCustomerRechargeActions } from '@/pages/delivery/app/actions/customer/profile/CustomerRechargeActions'
import { createCustomerSearchActions } from '@/pages/delivery/app/actions/customer/search/CustomerSearchActions'
import { createCustomerSupportActions } from '@/pages/delivery/app/actions/customer/support/CustomerSupportActions'
import type { CustomerActionContexts } from '@/objects/customer/page/CustomerActionObjects'

export function createCustomerActions(contexts: CustomerActionContexts) {
  return {
    ...createCustomerSearchActions(contexts.search),
    ...createCustomerOrderActions(contexts.order),
    ...createCustomerSupportActions(contexts.support),
    ...createCustomerProfileActions(contexts.profile),
    ...createCustomerRechargeActions(contexts.recharge),
  }
}
