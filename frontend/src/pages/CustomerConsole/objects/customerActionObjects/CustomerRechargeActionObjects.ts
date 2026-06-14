import type { CustomerActionParams } from '@/pages/CustomerConsole/objects/CustomerActionTypes'

export type CustomerRechargeParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customRechargeAmount'
  | 'selectedRechargeAmount'
  | 'runAction'
  | 'navigate'
  | 'setCustomRechargeAmount'
  | 'setSelectedRechargeAmount'
  | 'setRechargeFieldError'
>
