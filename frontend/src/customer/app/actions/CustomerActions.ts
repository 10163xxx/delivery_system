import { createCustomerOrderActions } from '@/customer/app/actions/CustomerOrderActions'
import { createCustomerProfileActions } from '@/customer/app/actions/CustomerProfileActions'
import { createCustomerRechargeActions } from '@/customer/app/actions/CustomerRechargeActions'
import { createCustomerSearchActions } from '@/customer/app/actions/CustomerSearchActions'
import { createCustomerSupportActions } from '@/customer/app/actions/CustomerSupportActions'
import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'

export function createCustomerActions(params: CustomerActionParams) {
  return {
    ...createCustomerSearchActions(params),
    ...createCustomerOrderActions(params),
    ...createCustomerSupportActions(params),
    ...createCustomerProfileActions(params),
    ...createCustomerRechargeActions(params),
  }
}
