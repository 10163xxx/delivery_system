import { createCustomerOrderActions } from '@/customer/app/actions/CustomerOrderActions'
import { createCustomerProfileActions } from '@/customer/app/actions/CustomerProfileActions'
import { createCustomerRechargeActions } from '@/customer/app/actions/CustomerRechargeActions'
import { createCustomerSearchActions } from '@/customer/app/actions/CustomerSearchActions'
import { createCustomerSupportActions } from '@/customer/app/actions/CustomerSupportActions'
import type { CustomerActionContexts } from '@/customer/object/action/CustomerActionObjects'

export function createCustomerActions(contexts: CustomerActionContexts) {
  return {
    ...createCustomerSearchActions(contexts.search),
    ...createCustomerOrderActions(contexts.order),
    ...createCustomerSupportActions(contexts.support),
    ...createCustomerProfileActions(contexts.profile),
    ...createCustomerRechargeActions(contexts.recharge),
  }
}
