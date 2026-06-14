import type { CustomerActionParams } from '@/pages/CustomerConsole/objects/CustomerActionTypes'

export type CustomerProfileParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customerNameDraft'
  | 'addressDraft'
  | 'runAction'
  | 'setError'
  | 'setAddressFormErrors'
  | 'setAddressDraft'
  | 'setSession'
>
