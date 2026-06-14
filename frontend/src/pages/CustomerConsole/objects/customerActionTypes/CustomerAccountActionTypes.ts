import type { Dispatch, SetStateAction } from 'react'
import type {
  AuthSession,
  DisplayText,
} from '@/objects/core/SharedObjects'
import type { CustomerAddressDraft } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export type CustomerAccountSetters = {
  setAddressDraft: Dispatch<SetStateAction<CustomerAddressDraft>>
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setCustomRechargeAmount: Dispatch<SetStateAction<DisplayText>>
  setSelectedRechargeAmount: Dispatch<SetStateAction<number | null>>
  setRechargeFieldError: Dispatch<SetStateAction<DisplayText | null>>
}
