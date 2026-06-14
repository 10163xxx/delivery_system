export type {
  CustomerActionServices,
  RunAction,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerActionServiceTypes'
export type {
  CustomerActionState,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerActionStateTypes'
export type {
  CustomerCheckoutInteractionSetters,
  CustomerCheckoutSetters,
  CustomerCheckoutState,
  CustomerCheckoutUiSetters,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerCheckoutActionTypes'
export type {
  CustomerDraftSetters,
  CustomerDraftState,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerDraftActionTypes'
export type {
  CustomerSearchState,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerSearchActionTypes'
export type {
  CustomerAccountSetters,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerAccountActionTypes'

import type { CustomerActionServices } from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerActionServiceTypes'
import type { CustomerActionState } from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerActionStateTypes'
import type {
  CustomerCheckoutInteractionSetters,
  CustomerCheckoutSetters,
  CustomerCheckoutState,
  CustomerCheckoutUiSetters,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerCheckoutActionTypes'
import type {
  CustomerDraftSetters,
  CustomerDraftState,
} from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerDraftActionTypes'
import type { CustomerSearchState } from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerSearchActionTypes'
import type { CustomerAccountSetters } from '@/pages/CustomerConsole/objects/customerActionTypes/CustomerAccountActionTypes'

export type CustomerActionParams = CustomerActionState &
  CustomerCheckoutState &
  CustomerDraftState &
  CustomerActionServices &
  CustomerSearchState &
  CustomerCheckoutSetters &
  CustomerCheckoutInteractionSetters &
  CustomerCheckoutUiSetters &
  CustomerDraftSetters &
  CustomerAccountSetters
