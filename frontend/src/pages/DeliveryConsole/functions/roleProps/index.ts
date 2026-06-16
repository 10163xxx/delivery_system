export { buildAdminProps } from '@/pages/AdminConsole/functions/roleProps/AdminRolePropsBuilder'
export { buildCustomerProps } from '@/pages/CustomerConsole/functions/roleProps/CustomerRolePropsBuilder'
export { buildMerchantProps } from '@/pages/MerchantConsole/functions/roleProps/MerchantRolePropsBuilder'
export { buildRiderProps } from '@/pages/RiderConsole/functions/roleProps/RiderRolePropsBuilder'
export type {
  AdminPropsArgs,
  CustomerPropsArgs,
  MerchantPropsArgs,
  RiderPropsArgs,
} from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
import { buildAdminProps } from '@/pages/AdminConsole/functions/roleProps/AdminRolePropsBuilder'
import { buildCustomerProps } from '@/pages/CustomerConsole/functions/roleProps/CustomerRolePropsBuilder'
import { buildMerchantProps } from '@/pages/MerchantConsole/functions/roleProps/MerchantRolePropsBuilder'
import { buildRiderProps } from '@/pages/RiderConsole/functions/roleProps/RiderRolePropsBuilder'

export type CustomerRoleProps = ReturnType<typeof buildCustomerProps>
export type MerchantRoleProps = ReturnType<typeof buildMerchantProps>
export type RiderRoleProps = ReturnType<typeof buildRiderProps>
export type AdminRoleProps = ReturnType<typeof buildAdminProps>
